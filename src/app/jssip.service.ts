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

    constructor(toneService: ToneService) {
        this.toneService = new ToneService;
        this.state = {
            status          : 'disconnected',
            session         : null,
            incomingSession : null
        };

        this._ua = null;
        const socket = new JsSIP.WebSocketInterface(this.settings.socket.uri);
        if (this.settings.socket.via_transport !== 'auto') {
            socket.via_transport = this.settings.socket.via_transport;
        }

        try {
            JsSIP.debug.enable('JsSIP:*');
            this._ua = new JsSIP.UA({
                uri                 : this.settings.uri,
                password            : this.settings.password,
                display_name        : this.settings.display_name,
                sockets             : [ socket ],
                registrar_server    : this.settings.registrar_server,
                contact_uri         : this.settings.contact_uri,
                authorization_user  : this.settings.authorization_user,
                instance_id         : this.settings.instance_id,
                session_timers      : this.settings.session_timers,
                use_preloaded_route : this.settings.use_preloaded_route
            });

            this.audioElement = document.body.appendChild(document.createElement('audio'));

        } catch (error) {
            console.log('JsSIP config error', error);
            return;
        }

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

            audioPlayer.play('ringing');
            this.setState({ incomingSession: session });

            session.on('failed', () => {
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
            });

            session.on('accepted', () => {
                audioPlayer.stop('ringing');
                this.setState({
                    session         : session,
                    incomingSession : null
                });
            });
        });

        this._ua.start();

        if (this.settings.callstats.enabled) {
            /*callstatsjssip(
                this._ua,
                this.settings.callstats.AppID,
                this.settings.callstats.AppSecret
            );*/
        }
    }

    setState(newState) {
        this.state = Object.assign({}, this.state, newState);
        return;
    }

    handleOutgoingCall(uri, dtmfs) {
        // CHANGE URI FOR TEST
        uri = dtmfs + '@sip.rhizomatica.org';
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
                offerToReceiveAudio : 1,
                offerToReceiveVideo : 0
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
            switch (data.cause) {
                case JsSIP.C.causes.NOT_FOUND:
                    message = audioPlayer.play('error_404');
                    break;
                case JsSIP.C.causes.CANCELED:
                    message = audioPlayer.play('rejected');
                    break;
                default:
                    message = audioPlayer.play('error_general');
            }

            // To keep the screen active while the error message is playing
            const onAudioEnded = (event) => {
                this.setState({ session: null });
                event.target.currentTime = 0;
                event.target.removeEventListener('ended', onAudioEnded, false);
            };
            message.addEventListener('ended', onAudioEnded);
        });

        session.on('ended', () => {
            this.toneService.stopRinging();
            audioPlayer.play('hangup');
            this.setState({ session: null });
        });

        session.connection.onaddstream = (e) => {
            this.audioElement.srcObject = e.stream;
            this.audioElement.play();
        };

        session.connection.onremovestream = (e) => {
            this.audioElement.pause();
        };

        session.on('accepted', () => {
            this.toneService.stopRinging();
            audioPlayer.play('answered');
        });
    }

    handleAnswerIncoming() {
        const session = this.state.incomingSession;
        session.answer({
            pcConfig : this.settings.pcConfig || { iceServers: [] }
        });
    }

    handleRejectIncoming() {
        const session = this.state.incomingSession;
        session.terminate();
    }

    handleHangup() {
        this.state.session.terminate();
        this.setState({session: null});
    }
}
