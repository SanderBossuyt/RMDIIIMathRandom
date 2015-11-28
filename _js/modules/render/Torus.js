'use strict';


import EventEmitter from 'eventemitter2';

export default class Torus extends EventEmitter {

  constructor(position, type){

    super();

    this.position = position;

    this.type = type;

    //if(this.type === Circle.FIXED) this._initFixed();
    //if(this.type === Circle.MOVING) this._initMoving();

    //this._onFrame();

  }

  render(){

    let {x, y, z} = this.position;

    //let range = 200;

    let geometry = new THREE.TorusGeometry( 10, 3, 7, 7 );

    let material = new THREE.MeshBasicMaterial( { color: '#efcc6f', shading: THREE.SmoothShading, overdraw: 0.5 } );


    let shape = new THREE.Mesh(geometry, material);
    this.shape = shape;

    shape.position.x = x;
    shape.position.y = y;
    shape.position.z = z;

    shape.castShadow = true;
    shape.receiveShadow = true;

    return shape;

  }

}
