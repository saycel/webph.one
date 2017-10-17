import FILES from './sounds';

const createAudio = (file) => {
    const audio = document.createElement('audio');
    audio.src = file;
    audio.autoplay = true;
    audio.volume = 0;
    document.body.appendChild(audio);
    return audio;
};

let SOUNDS = [
     {playing: null, name: 'answered', audio: createAudio(FILES['answered']), volume: 1.0 },
     {playing: null, name: 'rejected', audio: createAudio(FILES['rejected']), volume: 0.5 },
     {playing: null, name: 'hangup', audio: createAudio(FILES['hangup']),  volume: 1.0 },
     {playing: null, name: 'ringing', audio: createAudio(FILES['hangup']),  volume: 1.0 },
     {playing: null, name: 'error_404', audio: createAudio(FILES['error_404']),  volume: 1.0 },
     {playing: null, name: 'error_general', audio: createAudio(FILES['error_general']),  volume: 1.0 }
];

let initialized = false;

export default {
    /**
     * Play all the sounds so they will play in mobile browsers at any time
     */
    initialize() {
        if (initialized) {
            return;
        }

        for (const sound of SOUNDS)
        {
            try { sound.audio.play()
                .then( _ => {
                    sound.playing = true;
                    console.log('[SOUND SERVICE] - Init sound ' + sound.name, _ );
                })
                .catch((err) => {
                    console.log('[SOUND SERVICE] - Error on init ' + sound.name, err );
                });
            } catch (err) {
                console.log('[SOUND SERVICE] - Error on init ' + sound.name, err );
            }
        }
        initialized = true;
    },

    /**
     * Play a sound
     * @param name - Sound name
     * @param loop - Play in loop
     */
    play(name: string, loop = false): HTMLAudioElement {
        this.initialize();

        const sound = SOUNDS.filter(function(x){ return x.name === name; })[0];

        if (!sound) {
            throw new Error(`unknown sound name "${name}"`);
        }

        try {
            if ( sound.audio.readyState > 0 ) {
                sound.audio.currentTime = 0.0;
            }
            sound.audio.volume = (sound.volume || 1.0);
            sound.audio.loop = loop;
            sound.audio.play()
                .then( _ => {
                    sound.playing = true;
                    console.log('[SOUND SERVICE] - Play ' + sound.name, _ );
                })
                .catch((err) => {
                    console.log('[SOUND SERVICE] - Error on ' + sound.name, err );
                });
            return sound.audio;
        } catch (error) {
        }
    },

    stop(name) {
        const sound = SOUNDS.filter(function(x){ return x.name === name; })[0];

        if (!sound) {
            throw new Error(`unknown sound name "${name}"`);
        }
        if (sound.playing !== null) {
            sound.audio.pause();
            sound.playing = null;
        }
    },

    stopAll() {
        try {
            SOUNDS = SOUNDS.map(sound => {
                if (sound.playing) {
                    sound.audio.pause();
                    sound.playing = null;
                }
                return sound;
            });
        } catch (error) {
            console.log('Error on stop', error);
        }
    }
};
