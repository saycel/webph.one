import JsSIP from 'jssip';
import { Subject } from 'rxjs/Subject';

/* DEGUB */
JsSIP.debug.enable('JsSIP:*');

export class jsSipService {
  public events: Subject<string>;
  public status: string = 'hangup';
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
      'mediaConstraints' : { 'audio': true, 'video': false }
    };

    this.socket = new JsSIP.WebSocketInterface('wss://rhizortc.specialstories.org:8443');
    this.configuration['sockets'] = [this.socket];
    this.ua = new JsSIP.UA(this.configuration);
    this.ua.start();
  }

  call(number) {
      this.status = 'calling';
      this.ua.call(number,this.callOptions);
  }
  
  hangup() {
      this.status = 'hangup';
      this.ua.terminateSessions();

  }
}