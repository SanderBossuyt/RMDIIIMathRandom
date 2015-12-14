'use strict';

let Tuna = require('tunajs/tuna-min.js');

export default class Player {

  constructor(ctx){
    this.ctx = ctx;
    this.panner = this.ctx.createPanner();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.6;

    this.biquadFilter = this.ctx.createBiquadFilter();
    this.biquadFilter.type = 'highpass';
    this.biquadFilter.frequency.value = 278;
    this.biquadFilter.Q.value = 28;
    this.biquadFilter.gain.value = -1;

    this.tuna = new Tuna(this.ctx);
    this.timeValue = 333;
    this.position = 0;
    this.song = '-rsltl-f---rsltl----rsltl-f---fsfrr----rsltl-f--rsltl----rsltl-f--fsfrr-------zytly-lt-sl-zytly------zytly-lt-sl-fsfrr-------';
    this.scale = {
      d: 523.25,
      r: 554.37,
      m: 622.25,
      f: 698.46,
      s: 739.99,
      l: 830.61,
      t: 932.33,
      y: 1046.50,
      z: 1108.73
    };

  }

  playSoundtrack() {

    this.glitch = new this.tuna.PingPongDelay({
      wetLevel: 0.7,
      feedback: 0.7,
      delayTimeLeft: 250,
      delayTimeRight: 250
    });
    this.convolver = new this.tuna.Convolver({
      highCut: 800,
      lowCut: 20,
      dryLevel: 1,
      wetLevel: 1,
      level: 0.5,
      impulse: '../../../assets/sound/concert-crowd.ogg',
      bypass: 0
    });

    this.panner.panningModel = 'equalpower';

    this.play();

  }

  play() {

    let oscillator = this.ctx.createOscillator();
    oscillator.frequency.value = 0;
    oscillator.type = 'sawtooth';


    oscillator.connect(this.ctx.destination);
    oscillator.start(this.ctx.currentTime);

    oscillator.connect(this.biquadFilter);
    this.biquadFilter.connect(this.panner);
    this.panner.connect(this.glitch);
    this.glitch.connect(this.convolver);
    this.convolver.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    var note = this.song.charAt(this.position),
      freq = this.scale[note];
    this.position += 1;
    if(this.position >= this.song.length) {
      this.position = 0;
    }
    if(freq) {
      oscillator.frequency.value = freq;
    }

    oscillator.stop(this.ctx.currentTime + 0.2);

  }

}
