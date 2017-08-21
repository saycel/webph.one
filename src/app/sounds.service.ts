import FILES from './sounds';

const SOUNDS = [
     {name: 'ringing', audio: new Audio(FILES['ringing']),  volume: 1.0 },
     {name: 'answered', audio: new Audio(FILES['answered']), volume: 1.0 },
     {name: 'rejected', audio: new Audio(FILES['rejected']), volume: 0.5 }
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
    play(name, loop = false) {
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
    }
};
