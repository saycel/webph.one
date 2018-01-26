import soundService from './sounds.service';

describe('Sound service', () => {
    it('should get a sound service', () => {
        const a = soundService.initialize();
        expect(a).toBeTruthy();
        const b = soundService.initialize();
        expect(b).toBeFalsy();
    });

    it('should play a sound', () => {
        const a = soundService.play('answered', false);
        expect(typeof a).toBe('object');
    });

    it('should stop playing a sound', () => {
        const a = soundService.stop('answered');
        expect(a).toBeUndefined();
    });

    it('should stop all sound', () => {
        const a = soundService.stopAll();
        expect(a).toBeUndefined();
    });
});


