export const settings = {
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
    answer:
    {
        mediaConstraints: {
            audio: true,
            video: false
        },
        rtcOfferConstraints : {
            offerToReceiveAudio : true,
            offerToReceiveVideo : false
        }
    },
    call:
    {
        mediaConstraints: {
            audio: true,
            video: false
        },
        rtcOfferConstraints : {
            offerToReceiveAudio : true,
            offerToReceiveVideo : false
        }
    },
    custom:
    {
        // dtmfsGateway: null,
        dtmfsGateway: '385485876@did.callwithus.com',
        // outbound: 'peallagoon',
        outbound: null,
        defaultUtiDomain: 'rhizortc.specialstories.org',
        virtualNumbersPrefixs: [999100, 999200],
        virtualNumberPrefix: 999111,
        conferenceCallPrefixs: [500],
        fakeEmail: '@generic_email.saycel'
    }
};

export interface CustomSettingsI {
    dtmfsGateway?: string;
    outbound?: string;
    defaultUtiDomain: string;
    virtualNumbersPrefixs: number[];
    virtualNumberPrefix: number;
    fakeEmail: string;
    conferenceCallPrefixs: number[];
}
