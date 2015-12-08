'use strict';


import EventEmitter from 'eventemitter2';
let color;

export default class Torus extends EventEmitter {

  constructor(position, type){

    super();

    this.position = position;

    this.type = type;

    color = '#f9f9f9';

  }

  render(){

    let {x, y, z} = this.position;

    //let range = 200;


    let geometry = new THREE.TorusGeometry( 10, 3, 10, 11 );
    let material = new THREE.MeshPhongMaterial( { color: color, shading: THREE.FlatShading} );

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
