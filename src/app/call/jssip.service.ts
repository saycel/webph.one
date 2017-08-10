import JsSIP from 'jssip';
import { Subject } from 'rxjs/Subject';
import AudioPlayer from './sounds.service';

/* DEGUB */
JsSIP.debug.enable('JsSIP:*');

export class JsSipService {
  private audioPlayer = AudioPlayer;
  public events: Subject<string>;
  public status = 'hangup';
  private eventHandlers: object;
  private socket: any;
  private ua: any;
  private callOptions: object;

  private configuration = {
    display_name        : 'webrtc',
    uri                 : 'webrtc@rhizortc.specialstories.org',
    password            : 'verysecret',
    registrar_server    : null,
    contact_uri         : null,
    authorization_user  : null,
    instance_id         : null,
    session_timers      : true,
    use_preloaded_route : false,
    pcConfig            :
    {
        rtcpMuxPolicy : 'negotiate',
        iceServers    :
        [
            { urls : [ 'stun:stun.l.google.com:19302' ] }
        ]
    },
    callstats           :
    {
        enabled   : false,
        AppID     : null,
        AppSecret : null
    }
  };

  constructor() {
    this.events = new Subject<string>();
    this.eventHandlers = {
      'progress': (e) => {
       this.events.next('progress');
      },
      'failed': (e) => {
        this.events.next('failed');
        this.status = 'hangup';
      },
      'ended': (e) => {
        this.events.next('ended');
        this.status = 'hangup';
      },
      'confirmed': (e) => {
        this.events.next('confirmed');
      }
    };

    this.callOptions = {
      'eventHandlers'    : this.eventHandlers,
      'mediaConstraints' : { 'audio': true, 'video': false },
      'pcConfig' : this.configuration.pcConfig || { iceServers: [] },
      'rtcOfferConstraints' : {
            offerToReceiveAudio : 1,
            offerToReceiveVideo : 0
       },
       'sessionTimersExpires' : 120
    };

    this.socket = new JsSIP.WebSocketInterface('wss://rhizortc.specialstories.org:8443');
    this.socket.via_transport = 'auto';
    this.configuration['sockets'] = [this.socket];
    this.ua = new JsSIP.UA(this.configuration);
    this.ua.start();
  }

  call(number) {
    this.status = 'calling';
    //const session = this.ua.call('sip:pearllagoon@rhizortc.specialstories.org', this.callOptions);
    const session = this.ua.call('sip:385485876@did.callwithus.com', this.callOptions);

    session.on('progress', () => {
      this.audioPlayer.play('ringback', null);
    });

    session.on('failed', (data) => {
      this.audioPlayer.stop('ringback');
      this.audioPlayer.play('rejected', null);
    });

    session.on('ended', () =>	{
      this.audioPlayer.stop('ringback');
    });

    session.on('accepted', () => {
        this.audioPlayer.stop('ringback');
        this.audioPlayer.play('answered', null);
        setTimeout(() => {
        console.log('Sending tone ' + number + '#');

        const tones = number + '#';
        let dtmfSender = null;
        if (session.connection.getSenders) {
            dtmfSender = session.connection.getSenders()[0].dtmf;
        } else {
            const peerconnection = session.connection;
            const localStream = peerconnection.getLocalStreams()[0];
            dtmfSender = session.connection.createDTMFSender(localStream.getAudioTracks()[0]);
        }
        dtmfSender.insertDTMF(tones, 400, 50);
        }, 2000);
    });
  }

  hangup() {
      this.status = 'hangup';
      this.ua.terminateSessions();
  }
}
