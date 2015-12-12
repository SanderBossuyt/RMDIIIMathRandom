'use strict';

//import Effects from '../../data/Effects';
//import MathUtil from '../util/MathUtil';
import Utilsound from '../sound/Utilsound.js';
//let PitchShift = require('soundbank-pitch-shift');
//let concertHallBuffer = require('/public/assets/sound/concert-crowd.ogg');
let Tuna = require('tunajs/tuna-min.js');

export default class Player {

  constructor(ctx){

    this.ctx = ctx;
    this.panner = this.ctx.createPanner();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.6;

    this.biquadFilter = this.ctx.createBiquadFilter();
    this.biquadFilter.type = "highpass";
    this.biquadFilter.frequency.value = 278;
    this.biquadFilter.Q.value = 28;
    this.biquadFilter.gain.value = -1;

    this.tuna = new Tuna(this.ctx);
    this.timeValue = 333;
    this.position = 0;
    this.song = "-rsltl-f---rsltl----rsltl-f---fsfrr----rsltl-f--rsltl----rsltl-f--fsfrr-------zytly-lt-sl-zytly------zytly-lt-sl-fsfrr-------";
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
    //this.biquadFilter.detune.value = 400;


    /*
      this.biquadFilter = this.ctx.createBiquadFilter();
    this.biquadFilter.type = "highpass";
    this.biquadFilter.frequency.value = 7000;
    this.biquadFilter.Q.value = 20;
    this.biquadFilter.gain.value = 25;
    */
  }

  playSoundtrack(buffer) {

   this.glitch = new this.tuna.PingPongDelay({
        wetLevel: 0.7, //0 to 1
        feedback: 0.7, //0 to 1
        delayTimeLeft: 250, //1 to 10000 (milliseconds)
        delayTimeRight: 250 //1 to 10000 (milliseconds)
    });
    this.convolver = new this.tuna.Convolver({
        highCut: 800,                         //20 to 22050
        lowCut: 20,                             //20 to 22050
        dryLevel: 1,                            //0 to 1+
        wetLevel: 1,                            //0 to 1+
        level: 0.5,                               //0 to 1+, adjusts total output of both wet and dry
        impulse: "../../../assets/sound/concert-crowd.ogg",    //the path to your impulse response
        bypass: 0
    });


    //this.osc = this.ctx.createOscillator();

    


    this.panner.panningModel = 'equalpower';

    
    //this.osc.start(0);
    //this.osc.start(this.ctx.currentTime);

    this.play();

  }

  play() {

    let oscillator = this.ctx.createOscillator();
    oscillator.frequency.value = 0; // value in hertz
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

//oscillator.stop(this.ctx.currentTime + 0.2);
    oscillator.stop(this.ctx.currentTime + 0.2);


    }


   /*   let source = this.ctx.createOscillator();
      source.frequency.value = 500;
    //let source = this.ctx.createBufferSource();
    this.panner.panningModel = 'equalpower';

    /*this.pitchShift.transpose = 9;
    this.pitchShift.wet.value = 0;
    this.pitchShift.dry.value = 5;*/

    //source.buffer = buffer;*/
    /*source.type = 'sine';


    this.distortion = this.ctx.createWaveShaper();
    this.distortion.oversample = '1x';
    this.distortion.curve = Utilsound.makeDistortionCurve(10);


    source.connect(this.biquadFilter);

    this.biquadFilter.connect(this.panner);

    this.panner.connect(this.gainNode);

    this.gainNode.connect(this.ctx.destination);

    source.start();*/

    /*scale = {
            d: 16.35,
            r: 36.71,
            m: 41.20,
            f: 43.65,
            s: 49.00,
            l: 55.00,
            t: 61.74,
          },*/

  /*makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  }*/



}
