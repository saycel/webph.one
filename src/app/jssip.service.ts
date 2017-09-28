import { Injectable, Inject } from '@angular/core';

import JsSIP from 'jssip';
import { Subject } from 'rxjs/Subject';
import audioPlayer from './sounds.service';
import { ToneService } from './tone.service';

@Injectable()
export class JsSipService {
    public state: any;
    private audioElement: HTMLAudioElement;
    private toneService: ToneService;
    private _ua: any;
    private init = false;

    public settings = {
        display_name        : 'webrtc',
        uri                 : 'webrtc@rhizortc.specialstories.org',
        password            : 'verysecret',
        socket              :
        {
            uri           : 'wss://rhizortc.specialstories.org:8443',
            via_transport : 'auto',
        },
        registrar_server    : null,
        contact_uri         : null,
        authorization_user  : null,
        instance_id         : null,
        session_timers      : true,
        use_preloaded_route : false,
        pcConfig            :
        {
            rtcpMuxPolicy : 'negotiate',
            iceServers    :  []
        },
        callstats           :
        {
            enabled   : false,
            AppID     : null,
            AppSecret : null
        }
    };
    public socket: any;

    constructor(toneService: ToneService) {
        this.toneService = new ToneService;
        this.state = {
            status          : 'disconnected',
            session         : null,
            incomingSession : null
        };
        this.socket = new JsSIP.WebSocketInterface(this.settings.socket.uri);
        if (this.settings.socket.via_transport !== 'auto') {
            this.socket.via_transport = this.settings.socket.via_transport;
        }
    }

    connect(credentials) {
        if (!credentials && this.init === true ) {
            return;
        }
        this._ua = null;
        this.init = true;

        try {
            credentials.uri = (credentials.user) ? credentials.user + '@rhizortc.specialstories.org' : null;
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

        } catch (error) {
            console.log('JsSIP config error', error);
            return;
        }

        // Add events to ua
        this.addEvents();

        // Start ua
        this._ua.start();
    }

    addEvents() {
        this._ua.on('connecting', () => {
            this.setState(
                {
                    uri    : this._ua.configuration.uri.toString(),
                    status : 'connecting'
                });
        });

        this._ua.on('connected', () => {
            this.setState({ status: 'connected' });
            this._ua.register();
        });

        this._ua.on('disconnected', () => {
            this.setState({ status: 'disconnected' });
        });

        this._ua.on('registered', () => {
            this.setState({ status: 'registered' });
        });

        this._ua.on('registering', () => {
            console.log('registering');
        });

        this._ua.on('registrationFailed', () => {
            console.log('registrationFailed');
        });

        this._ua.on('unregistered', () => {
            if (this._ua.isConnected()) {
                this.setState({ status: 'connected' });
            } else {
                this.setState({ status: 'disconnected' });
            }
        });

        this._ua.on('registrationFailed', (data) => {
            if (this._ua.isConnected()) {
                this.setState({ status: 'connected' });
            } else {
                this.setState({ status: 'disconnected' });
            }
        });

        this._ua.on('newRTCSession', (data) => {
            if (data.originator === 'local') {
                return;
            }

            const state = this.state;
            const session = data.session;

            // Avoid if busy or other incoming
            if (state.session || state.incomingSession) {
                session.terminate(
                    {
                        status_code   : 486,
                        reason_phrase : 'Busy Here'
                    });
                return;
            }

            audioPlayer.play('ringing', true);
            this.setState({ incomingSession: data });

            // Show notification if the app is not in front
            if (document.hidden === true) {
                    const a = new Notification('Webph.one - Incoming call', {
                                body: data.session.remote_identity.display_name,
                                tag: 'request',
                                icon: 'assets/icons/android-chrome-192x192.png',
                            });
                    a.onclick = function (event) {
                        window.focus();
                        a.close();
                    };
            }

            session.on('failed', (err) => {
                audioPlayer.stop('ringing');
                this.setState({
                    session         : null,
                    incomingSession : null
                });
            });

            session.on('ended', () => {
                this.setState({
                    session         : null,
                    incomingSession : null
                });
                this.audioElement.pause();
                document.body.removeChild(this.audioElement);
                this.audioElement = null;
            });

            session.on('accepted', () => {
                audioPlayer.stop('ringing');
                this.setState({
                    session         : session,
                    incomingSession : null
                });
            });

        });
    }

    setState(newState) {
        this.state = Object.assign({}, this.state, newState);
        return;
    }

    handleOutgoingCall(uri, dtmfs: string) {
        // CHANGE URI FOR TEST
        uri = 'sip:385485876@did.callwithus.com';

        // Check if the dtmfs has 500 or 999 as prefix
        const noOnSipCall = (dtmfs.slice(0, 3) === '500' || dtmfs.slice(0, 3) === '999' );
        if (noOnSipCall) {
            uri = `sip:${dtmfs}@rhizortc.specialstories.org`;
        } else if ( dtmfs.includes('@') === true ) {
            uri = dtmfs;
        }

        // uri = 'sip:pearllagoon@rhizortc.specialstories.org';
        // uri = 'hello@onsip.com';
        const session = this._ua.call(uri, {
            pcConfig : this.settings.pcConfig || { iceServers: [] },
            mediaConstraints :
            {
                audio : true,
                video : false
            },
            rtcOfferConstraints :
            {
                offerToReceiveAudio : true,
                offerToReceiveVideo : false
            },
            sessionTimersExpires : 120
        });

        session.on('connecting', () => {
            this.toneService.startRinging();
            this.setState({ session });
        });

        session.on('progress', () => {
        });

        session.on('failed', (data) => {
            this.toneService.stopRinging();
            let message: HTMLAudioElement;

            // To keep the screen active while the error message is playing
            const addAudioEvent = (audio: HTMLAudioElement) => {
                const onAudioEnded = (event) => {
                    this.setState({ session: null });
                    event.target.currentTime = 0;
                    event.target.removeEventListener('ended', onAudioEnded, false);
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
                        this.toneService.stopBusyTone();
                        this.setState({ session: null });
                    }, 5000);
                    break;
                default:
                    message = audioPlayer.play('error_general');
                    addAudioEvent(message);
            }

        });

        session.on('ended', () => {
            this.toneService.stopRinging();
            audioPlayer.play('hangup');
            document.body.removeChild(this.audioElement);
            this.audioElement = null;
            this.setState({ session: null });
        });

        session.connection.onaddstream = (e) => {
            this.audioElement = document.body.appendChild(document.createElement('audio'));
            this.audioElement.srcObject = e.stream;
            this.audioElement.play();
        };

        session.connection.onremovestream = (e) => {
            this.audioElement.pause();
        };

        session.on('accepted', () => {
            this.toneService.stopRinging();
            audioPlayer.play('answered');

            if (!noOnSipCall) {
                setTimeout(() => {
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

                }, 2000);
            }
        });
    }

    handleAnswerIncoming() {
        const session = this.state.incomingSession.session;

        session.answer({
            mediaConstraints: {
                audio: true,
                video: false
            },
            rtcOfferConstraints : {
                offerToReceiveAudio : true,
                offerToReceiveVideo : false
            }
        });
        session.connection.onaddstream = (e) => {
            this.audioElement = document.body.appendChild(document.createElement('audio'));
            this.audioElement.srcObject = e.stream;
            this.audioElement.play();
        };

        session.connection.onremovestream = (e) => {
            this.audioElement.pause();
            console.log('onremovestream');
        };
    }

    handleRejectIncoming() {
        const session = this.state.incomingSession.session;
        session.terminate({status_code: 487});
        audioPlayer.stopAll();
    }

    handleHangup() {
        // If is any tone o sound playing
        this.toneService.stopAll();
        audioPlayer.stopAll();
        try {
            this.state.session.terminate();
            this.setState({ session: null });
        } catch (err) {
            this.setState({ session: null });
        }
    }
}
