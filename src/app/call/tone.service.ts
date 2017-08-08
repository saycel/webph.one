export class ToneService {

  public freq1: number;
  public freq2: number;
  private AudioContext: AudioContextBase;
  private status: number = 0;
  private osc1: OscillatorNode;
  private osc2: OscillatorNode;
  private gainNode: GainNode;
  private filter: BiquadFilterNode;
  private dtmfFrequencies = {
    "1": {f1: 697, f2: 1209},
    "2": {f1: 697, f2: 1336},
    "3": {f1: 697, f2: 1477},
    "4": {f1: 770, f2: 1209},
    "5": {f1: 770, f2: 1336},
    "6": {f1: 770, f2: 1477},
    "7": {f1: 852, f2: 1209},
    "8": {f1: 852, f2: 1336},
    "9": {f1: 852, f2: 1477},
    "*": {f1: 941, f2: 1209},
    "0": {f1: 941, f2: 1336},
    "#": {f1: 941, f2: 1477}
  };


  constructor() {
      this.AudioContext = new AudioContext();
  }

  setup() {
    
    this.osc1 = this.AudioContext.createOscillator();
    this.osc2 = this.AudioContext.createOscillator();
    this.gainNode = this.AudioContext.createGain();
    this.gainNode.gain.value = 0.25;
    this.filter = this.AudioContext.createBiquadFilter();
    this.filter.type = "lowpass";
    this.osc1.connect(this.filter);
    this.osc2.connect(this.filter);
    this.gainNode.connect(this.filter);
    this.filter.connect(this.AudioContext.destination);
  }

  stop() {
    this.osc1.stop(0);
    this.osc2.stop(0);
    this.status = 0;
  }

  start(keyPressed) {
    if (this.status === 0) {
        this.setup();

        let frequencyPair = this.dtmfFrequencies[keyPressed];
        
        this.freq1 = frequencyPair.f1;
        this.freq2 = frequencyPair.f2;

        this.osc1.frequency.value = this.freq1;
        this.osc2.frequency.value = this.freq2;

        this.osc1.start(0);
        this.osc2.start(0);
        this.status = 1;
    } else {
        this.stop();
    }
    setTimeout(()=>this.stop(),230);
  }  
}