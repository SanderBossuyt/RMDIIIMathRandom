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


    let geometry = new THREE.TorusGeometry( 10, 3, 22, 11 );
    let material = new THREE.MeshBasicMaterial( { color: color, overdraw: 0.1 } );

    let shape = new THREE.Mesh(geometry, material);
    this.shape = shape;

    shape.position.x = x;
    shape.position.y = y;
    shape.position.z = z;

    shape.castShadow = true;
    shape.receiveShadow = true;

    return shape;

  }

  renderSucceed(){

    let {x, y, z} = this.position;

    //let range = 200;

    let geometry = new THREE.TorusGeometry( 11, 4, 22, 11 );
    let material = new THREE.MeshBasicMaterial( { color: '#D74C4F', shading: THREE.SmoothShading, overdraw: 0.5 } );

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
