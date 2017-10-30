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
        dtmfsGateway: null,
        outbound: 'peallagoon',
        defaultUtiDomain: 'rhizortc.specialstories.org',
        virtualNumbersPrefixs: [999100, 999200],
        conferenceCallPrefixs: [500]
    }
};

export interface CustomSettingsI {
    dtmfsGateway?: string;
    outbound?: string;
    defaultUtiDomain: string;
    virtualNumbersPrefixs: number[];
    conferenceCallPrefixs: number[];
}
