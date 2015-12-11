'use strict';

//import Effects from '../../data/Effects';
//import MathUtil from '../util/MathUtil';
import Utilsound from '../sound/Utilsound.js';
//let PitchShift = require('soundbank-pitch-shift');


export default class Player {

  constructor(ctx){
    this.ctx = ctx;
    this.panner = this.ctx.createPanner();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.6;

    this.biquadFilter = this.ctx.createBiquadFilter();
    this.biquadFilter.type = "highshelf";
    this.biquadFilter.frequency.value = 3000;
    //this.biquadFilter.Q.value = 20;
    this.biquadFilter.gain.value = 25;
    this.biquadFilter.detune.value = 400;

    /*
      this.biquadFilter = this.ctx.createBiquadFilter();
    this.biquadFilter.type = "highpass";
    this.biquadFilter.frequency.value = 7000;
    this.biquadFilter.Q.value = 20;
    this.biquadFilter.gain.value = 25;
    */
  }

  playSoundtrack(buffer) {

    let source = this.ctx.createBufferSource();
    this.panner.panningModel = 'equalpower';

    /*this.pitchShift.transpose = 9;
    this.pitchShift.wet.value = 0;
    this.pitchShift.dry.value = 5;*/

    source.buffer = buffer;


    this.distortion = this.ctx.createWaveShaper();
    this.distortion.oversample = '1x';
    this.distortion.curve = Utilsound.makeDistortionCurve(10);


    source.connect(this.biquadFilter);

    this.biquadFilter.connect(this.panner);

    this.panner.connect(this.gainNode);

    this.gainNode.connect(this.ctx.destination);

    source.start();

  }

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
