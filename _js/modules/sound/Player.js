'use strict';

//import Effects from '../../data/Effects';
//import MathUtil from '../util/MathUtil';

export default class Player {

  constructor(ctx){
    this.ctx = ctx;
    this.panner = this.ctx.createPanner();
  }

  /*play(moving, fixed){

    let source;

    if(fixed.type === 'samples'){
      source = this.ctx.createBufferSource();
      source.buffer = fixed.sample;
    }else{
      source = this.ctx.createOscillator();
      source.frequency.value = fixed.frequency;
    }

    let panner = this.ctx.createPanner();
    panner.panningModel = 'equalpower';
    panner.setPosition(
      fixed.panning,
      0,
      1 - Math.abs(fixed.panning)
    );

    let gain = this.ctx.createGain();
    gain.gain.value = fixed.volume;

    source.connect(panner);
    panner.connect(gain);

    let effect = moving.effect.type;

    if(effect === Effects.FILTER.type){

      let filter = this.ctx.createBiquadFilter();

      filter.type = Math.round(Math.random()) ? 'highpass': 'lowpass';
      //filter.frequency.value = MathUtil.randomBetween(1000, 9000);

      filter.gain.value = 60;
      gain.connect(filter);

      filter.connect(this.ctx.destination);

    }else if(effect === Effects.DELAY.type){

      let delay = this.ctx.createDelay(0.6 + (Math.random()*2));

      gain.connect(delay);

      gain.connect(this.ctx.destination);
      delay.connect(this.ctx.destination);

    }else{

      gain.connect(this.ctx.destination);

    }

    source.start();

    if(fixed.type === 'osc'){
      source.stop(this.ctx.currentTime + 0.2);
    }

  }*/

  setPannerPosition(Pos) {
    console.log("in func");
    /*this.panner.setPosition(
      Pos,
      0,
      1 - Math.abs(Pos)
    );*/
  }

  playSoundtrack(buffer, panningVal) {
    console.log("playSoundtrack");
    let source = this.ctx.createBufferSource(); // creates a sound source

    this.panner.panningModel = 'equalpower';
    /*this.panner.setPosition(
      panningVal,
      0,
      1 - Math.abs(panningVal)
    );*/

    //source.connect(this.panner);

    source.buffer = buffer;
    source.connect(this.panner);
    this.panner.connect(this.ctx.destination);
    source.start();

  }

}
