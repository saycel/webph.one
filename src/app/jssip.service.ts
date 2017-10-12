import { Injectable, Inject } from '@angular/core';

import JsSIP from 'jssip';
import { settings, CustomSettingsI } from './jssip.config';
import { Subject } from 'rxjs/Subject';
import audioPlayer from './sounds.service';
import { ToneService } from './tone.service';

@Injectable()
export class JsSipService {
    private _audioElement: HTMLAudioElement;
    private _ua: any;
    public settings = settings;
    public socket: any;

    public state = {
        init            : false,
        status          : 'disconnected',
        session         : null,
        ringing         : false,
        incomingSession : null
    };

    constructor(public toneService: ToneService) {
    }

    setState(newState) {
        this.state = Object.assign({}, this.state, newState);
        return;
    }

    connect(credentials) {
        // Check credentials and if jsSIP is alredy started
        if (!credentials && this.state.init === true ) {
            return;
        }

        // Start socket
        this.socket = new JsSIP.WebSocketInterface(this.settings.socket.uri);
        if (this.settings.socket.via_transport !== 'auto') {
            this.socket.via_transport = this.settings.socket.via_transport;
        }

        // Setup JsSIP
        try {
            credentials.uri = credentials.user + '@' + this.settings.custom.defaultUtiDomain;
            JsSIP.debug.enable('JsSIP:*');
            this._ua = new JsSIP.UA({
                uri                 : credentials.uri || this.settings.uri,
                password            : credentials.password || this.settings.password,
                display_name        : credentials.user || this.settings.display_name,
                sockets             : [ this.socket ],
                registrar_server    : this.settings.registrar_server,
                contact_uri         : this.settings.contact_uri,
                authorization_user  : this.settings.authorization_user,
                instance_id         : this.settings.instance_id,
                session_timers      : this.settings.session_timers,
                use_preloaded_route : this.settings.use_preloaded_route
            });

            // Add events to JsSIP
            this.addEvents(this._ua);

            // Start JsSIP
            this._ua.start();
            this.setState({init : true });

        } catch (error) {
            console.log('JsSIP config error', error);
            return;
        }
    }

    addEvents(sipUa) {
        sipUa.on('connecting', () =>
            this.setState({ status : 'connecting' }));

        sipUa.on('connected', () => {
            this.setState({ status: 'connected' });
            sipUa.register();
        });

        sipUa.on('disconnected', () =>
            this.setState({ status: 'disconnected' }));

        sipUa.on('registered', () =>
            this.setState({ status: 'registered' }));

        sipUa.on('unregistered', () => {
            const connected = (sipUa.isConnected()) ? 'connected' : 'disconneted';
            this.setState({ status:  connected});
        });

        sipUa.on('registrationFailed', (data) => {
            const connected = (sipUa.isConnected()) ? 'connected' : 'disconneted';
            this.setState({ status:  connected});
        });

        sipUa.on('newRTCSession', (data) => {
            if (data.originator === 'local') { return; } // Catch incoming actions only
            this.handleIncomingCall(data);
        });
    }

    /**
     * Handle incomming call events
     * @param data jsSip data session { session:object, incomingSession: object }
     */
    handleIncomingCall(data) {
        data.session.on('failed', (err) => {
            this.clearSessions();
            this.removeSounds();
        });

        data.session.on('ended', () => {
            this.clearSessions();
            this.removeSounds();
        });

        data.session.on('accepted', () => {
            audioPlayer.stop('ringing');
            this.setState({
                session         : data.session,
                incomingSession : null
            });
        });

        // Avoid if busy or other incoming
        if (this.state.session || this.state.incomingSession) {
            data.session.terminate({
                status_code   : 486,
                reason_phrase : 'Busy Here'
            });
            return;
        } else {
            // Start ringing and set the incoming session in the state
            this.incomingNotification(data);
            this.setState({ incomingSession: data });
        }
    }

    handleOutgoingCall(uri, dtmfs: string) {
        // Get call method
        const callMethod = this.checkPrefixs(dtmfs, this.settings.custom);
        // Format uri
        switch (callMethod) {
            case 'virtual':     uri = `sip:${dtmfs}@${this.settings.custom.defaultUtiDomain}`; break;
            case 'conference':  uri = `sip:${dtmfs}@${this.settings.custom.defaultUtiDomain}`; break;
            case 'sip':         uri = dtmfs; break;
            case 'dtmfs':       uri = this.settings.custom.dtmfsGateway; break;
            default:            uri = `sip:${dtmfs}@${this.settings.custom.defaultUtiDomain}`;
        }
        // Start session
        const session = this._ua.call(uri, {
            pcConfig             : this.settings.pcConfig || { iceServers: [] },
            mediaConstraints     : this.settings.call.mediaConstraints,
            rtcOfferConstraints  : this.settings.call.rtcOfferConstraints,
            sessionTimersExpires : 120
        });

        session.on('connecting', () => {
            this.toneService.startRinging();
            this.setState({ session });
        });

        session.on('failed', (data) => {
            this.removeSounds();
            let message: HTMLAudioElement;

            // Keep screen active while the error message is playing
            const addAudioEvent = (audio: HTMLAudioElement) => {
                const onAudioEnded = (event) => {
                    this.clearSessions();
                    event.target.removeEventListener('ended', onAudioEnded, false);
                    message = null;
                };
                audio.addEventListener('ended', onAudioEnded);
            };

            switch (data.cause) {
                case JsSIP.C.causes.NOT_FOUND:
                    message = audioPlayer.play('error_404');
                    addAudioEvent(message);
                    break;
                case JsSIP.C.causes.CANCELED:
                    message = audioPlayer.play('rejected');
                    addAudioEvent(message);
                    break;
                case JsSIP.C.causes.BUSY:
                    this.toneService.startBusyTone();
                    setTimeout(() => {
                        this.removeSounds();
                        this.clearSessions();
                    }, 5000);
                    break;
                default:
                    message = audioPlayer.play('error_general');
                    addAudioEvent(message);
            }

        });

        session.on('ended', () => {
            this.removeSounds();
            this.clearSessions();
            audioPlayer.play('hangup');
        });

        session.connection.onaddstream = (e) => {
            this.addStream(e);
        };

        session.connection.onremovestream = (e) => {
          this.removeSounds();
        };

        session.on('accepted', () => {
            this.toneService.stopRinging();
            audioPlayer.play('answered');
            // If is call type is drmfs send tones after connect
            if (callMethod === 'dtmfs') {
                setTimeout(() => this.dtmfsCall(dtmfs, session), 2000);
            }
        });
    }

    handleAnswerIncoming() {
        this.state.incomingSession.session.answer(this.settings.answer);
        this.state.incomingSession.session.connection.onaddstream = this.addStream;
        this.state.incomingSession.session.connection.onremovestream = this.removeSounds;
    }

    handleRejectIncoming() {
        this.state.incomingSession.session.terminate({status_code: 487});
        this.clearSessions();
    }

    handleHangup() {
        try {
            this.state.session.terminate();
        } catch (error) {
            console.log('Session already finished');
        }
        this.removeSounds();
        this.clearSessions();
    }

    /**
     * Notifications on incoming call
     * @param data Incoming rtc session
     */
    incomingNotification(data) {
        audioPlayer.play('ringing', true);
        if (document.hidden === true) {
            try {
                console.log('[SW] - Document is hidden - Sending push notification');
                navigator.serviceWorker.getRegistration()
                    .then( (registration: any) => {
                        const a = registration.showNotification('Webph.one - Incoming call', {
                            body: data.session.remote_identity.display_name,
                            vibrate: [200, 100, 200, 100, 200, 100, 400],
                            tag: 'document-hidden',
                            icon: 'assets/icons/android-chrome-192x192.png',
                            actions: [
                            { action: 'yes', title: 'Answer' },
                            { action: 'no', title: 'Hang up' }
                            ]
                        });
                    });
            } catch (error) {
                console.log('NOTIFICATION ERROR', error);
            }
        }
        return;
    }

    /**
     * Set all sessions state to null
     */
    clearSessions() {
        this.setState({
            session: null,
            incomingSession: null
        });
    }

    /**
     * Play audio stream
     * @param e Stream event
     */
    addStream(e) {
        this._audioElement = document.body.appendChild(document.createElement('audio'));
        this._audioElement.srcObject = e.stream;
        this._audioElement.play();
    }

    /**
     * Stop all sounds and remove audio elements
     */
    removeSounds() {
        // If is ringing
        this.toneService.stopAll();

        // If is playing a message
        audioPlayer.stopAll();

        // If an audio element exist
        if (this._audioElement) {
            document.body.removeChild(this._audioElement);
            this._audioElement = null;
        }
    }

    /**
     * Check what type of number is
     * @param phoneNumber Numbero or uri to call
     * @param prefixs settings.custom on jssip.config.ts
     */
    checkPrefixs (phoneNumber: string, cs: CustomSettingsI) {
        const isPrefix = (prefix: number) => {
            return phoneNumber.slice( 0, prefix.toString().length) === prefix.toString();
        };

        if      ( phoneNumber.includes('@') )                            { return 'sip'; }
        else if ( cs.virtualNumbersPrefixs.filter(isPrefix).length > 0)  { return 'virtual'; }
        else if ( cs.conferenceCallPrefixs.filter(isPrefix).length > 0)  { return 'conference'; }
        else if ( cs.dtmfsGateway !== null )                             { return 'dtmfs'; }

        return 'standar';
    }

    /**
     * Send tones on jsSip session
     * @param dtmfs Tones to send
     * @param session jsSip session
     */
    dtmfsCall(dtmfs: string, session: any) {
        const tones = dtmfs + '#';
        let dtmfSender = null;
        if (session.connection.signalingState !== 'closed') {
            if (session.connection.getSenders) {
                dtmfSender = session.connection.getSenders()[0].dtmf;
            } else {
                const peerconnection = session.connection;
                const localStream = peerconnection.getLocalStreams()[0];
                dtmfSender = session.connection.createDTMFSender(localStream.getAudioTracks()[0]);
            }
            dtmfSender.insertDTMF(tones, 400, 50);
            console.log('Sending DTMF codes', tones);
        }
    }
}
