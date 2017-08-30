import { Injectable } from '@angular/core';

@Injectable()
export class ToneService {

  public freq1 = 400;
  public freq2 = 450;
  private AudioContext: AudioContextBase;
  private status = 0;
  private osc1: OscillatorNode;
  private osc2: OscillatorNode;
  private gainNode: GainNode;
  private filter: BiquadFilterNode;
  private ringerLFOSource: AudioBufferSourceNode;
  private ringerLFOBuffer: AudioBuffer;
  private dtmfFrequencies = {
    '1': {f1: 697, f2: 1209},
    '2': {f1: 697, f2: 1336},
    '3': {f1: 697, f2: 1477},
    '4': {f1: 770, f2: 1209},
    '5': {f1: 770, f2: 1336},
    '6': {f1: 770, f2: 1477},
    '7': {f1: 852, f2: 1209},
    '8': {f1: 852, f2: 1336},
    '9': {f1: 852, f2: 1477},
    '*': {f1: 941, f2: 1209},
    '0': {f1: 941, f2: 1336},
    '#': {f1: 941, f2: 1477}
  };


  constructor() {
      this.AudioContext = new AudioContext();
      this.status = 0;
      this.setup();
  }

  setup() {
    this.osc1 = this.AudioContext.createOscillator();
    this.osc2 = this.AudioContext.createOscillator();
    this.osc1.frequency.value = this.freq1;
    this.osc2.frequency.value = this.freq2;

    this.gainNode = this.AudioContext.createGain();
    this.gainNode.gain.value = 0.25;

    this.filter = this.AudioContext.createBiquadFilter();
    this.filter.type = 'lowpass';

    this.osc1.connect(this.gainNode);
    this.osc2.connect(this.gainNode);

    this.gainNode.connect(this.filter);
    this.filter.connect(this.AudioContext.destination);
  }

  stop() {
    if (this.status === 1) {
      this.osc1.stop(0);
      this.osc2.stop(0);
      this.status = 0;
    }
  }

  genericStart() {
    if (this.status === 0) {
      this.osc1.start(0);
      this.osc2.start(0);
      this.status = 1;
    }
  }

  start(keyPressed) {
    if (this.status === 0) {
        const frequencyPair = this.dtmfFrequencies[keyPressed];
        this.freq1 = frequencyPair.f1;
        this.freq2 = frequencyPair.f2;
        this.setup();
        this.genericStart();

    } else {
        this.stop();
    }

    setTimeout(() => this.stop(), 150);
  }

  createRingerLFO() {
    const channels = 1;
    const sampleRate = this.AudioContext.sampleRate;
    const frameCount = sampleRate * 3;
    const arrayBuffer = this.AudioContext.createBuffer(channels, frameCount, sampleRate);
    const bufferData = arrayBuffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        if ((i / sampleRate > 0 && i / sampleRate < 0.4) || (i / sampleRate > 0.6 && i / sampleRate < 1.0)) {
            bufferData[i] = 0.25;
        }
    }
    this.ringerLFOBuffer = arrayBuffer;
  }

  createBusyTone() {
    const channels = 1;
    const sampleRate = this.AudioContext.sampleRate;
    const frameCount = sampleRate;
    const arrayBuffer = this.AudioContext.createBuffer(channels, frameCount, sampleRate);
    const bufferData = arrayBuffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        if ((i / sampleRate > 0 && i / sampleRate < 0.3) || (i / sampleRate > 0.5 && i / sampleRate < 0.8)) {
            bufferData[i] = 0.25;
        }
    }
    this.ringerLFOBuffer = arrayBuffer;
  }

  startRinging() {
    if (this.status === 0) {
        this.setup();
        this.genericStart();
        this.createRingerLFO();
        this.status = 1;
        this.gainNode.gain.value = 0;
        this.ringerLFOSource = this.AudioContext.createBufferSource();
        this.ringerLFOSource.buffer = this.ringerLFOBuffer;
        this.ringerLFOSource.loop = true;
        this.ringerLFOSource.start(0);
        this.ringerLFOSource.connect(this.gainNode.gain);
        this.status = 1;
    }
  }

  stopRinging() {
      if ( typeof this.ringerLFOSource !== 'undefined' ) {
        this.ringerLFOSource.stop();
      }
      this.stop();
      this.status = 0;
  }

  startBusyTone() {
    if (this.status === 0) {
        this.setup();
        this.genericStart();
        this.createBusyTone();
        this.status = 1;
        this.gainNode.gain.value = 0;
        this.ringerLFOSource = this.AudioContext.createBufferSource();
        this.ringerLFOSource.buffer = this.ringerLFOBuffer;
        this.ringerLFOSource.loop = true;
        this.ringerLFOSource.start(0);
        this.ringerLFOSource.connect(this.gainNode.gain);
        this.status = 1;
    }
  }

  stopBusyTone() {
      if ( typeof this.ringerLFOSource !== 'undefined' ) {
        this.ringerLFOSource.stop();
      }
      this.stop();
      this.status = 0;
  }

  stopAll() {
    this.stopBusyTone();
    this.stopRinging();
  }
}
