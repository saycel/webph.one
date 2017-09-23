import FILES from './sounds';

const SOUNDS = [
     {name: 'answered', audio: new Audio(FILES['answered']), volume: 1.0 },
     {name: 'rejected', audio: new Audio(FILES['rejected']), volume: 0.5 },
     {name: 'hangup', audio: new Audio(FILES['hangup']),  volume: 1.0 },
     {name: 'ringing', audio: new Audio(FILES['hangup']),  volume: 1.0 },
     {name: 'error_404', audio: new Audio(FILES['error_404']),  volume: 1.0 },
     {name: 'error_general', audio: new Audio(FILES['error_general']),  volume: 1.0 }
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
            sound.audio.volume = 0;
            try { sound.audio.play(); } catch (error) {}
        }
        initialized = true;
    },

    /**
     * Play a sound
     * @param {String} name - Sound name
     * @param {[Float]} relativeVolume - Relative volume (0.0 - 1.0)
     */
    play(name, loop = false): HTMLAudioElement {
        this.initialize();

        const sound = SOUNDS.filter(function(x){ return x.name === name; })[0];

        if (!sound) {
            throw new Error(`unknown sound name "${name}"`);
        }

        try {
            sound.audio.pause();
            sound.audio.currentTime = 0.0;
            sound.audio.volume = (sound.volume || 1.0);
            sound.audio.loop = loop;
            sound.audio.play();
            return sound.audio;
        } catch (error) {
        }
    },

    stop(name) {
        const sound = SOUNDS.filter(function(x){ return x.name === name; })[0];

        if (!sound) {
            throw new Error(`unknown sound name "${name}"`);
        }

        sound.audio.pause();
        sound.audio.currentTime = 0.0;
    },

    stopAll() {
        SOUNDS.forEach(sound => {
            sound.audio.pause();
            sound.audio.currentTime = 0.0;
        });
    }
};
