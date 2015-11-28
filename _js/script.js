'use strict';

// some features need the be polyfilled..
// https://babeljs.io/docs/usage/polyfill/

// import 'babel-core/polyfill';
// or import specific polyfills
// import {$} from './helpers/util';


import helloworldTpl from '../_hbs/helloworld';
//let tracking = require('tracking');

//var THREE = require('three');
let OrbitControls = require('three-orbit-controls')(THREE);
let scene, camera, renderer;

const init = () => {


    //let myTracker = new tracking.Tracker('target');



  console.log(helloworldTpl({name: 'Bossuyt Sander & Verheye Lieselot'}));
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );
  camera.position.x = 100;
  camera.position.y = 100;
  camera.position.z = 200;
  renderer = new THREE.WebGLRenderer();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
  //console.log(OrbitControls);
  new OrbitControls(camera);
  document.querySelector('main').appendChild(renderer.domElement);




  //box();
  //spheres = createSpheres(50);
  /*var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var cube = new THREE.Mesh( geometry, material );*/



  let geometry = new THREE.SphereGeometry(20, 10, 10);
  let material = new THREE.MeshBasicMaterial({
    color: '#ff2354',
    wireframe: true
  });
  let shape = new THREE.Mesh(geometry, material);
  shape.position.x = 0;
  shape.position.y = 40;
  shape.position.z = 0;
  scene.add( shape );


  let floorMaterial = new THREE.MeshBasicMaterial({
    color: '#5423ff',
    wireframe: true
  });
  let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
  let floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = 1;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);


  render();
};

const render = () => {
  //move();
  renderer.render(scene, camera);
  requestAnimationFrame(() => render());

};

init();


