'use strict';

// some features need the be polyfilled..
// https://babeljs.io/docs/usage/polyfill/

// import 'babel-core/polyfill';
// or import specific polyfills
// import {$} from './helpers/util';

import {settings, figure} from './data/';
import helloworldTpl from '../_hbs/helloworld';
import Torus from './modules/render/Torus';


//let tracking = require('tracking');

//var THREE = require('three');
let OrbitControls = require('three-orbit-controls')(THREE);
let scene, camera, renderer;
let fixedArr = [];
let levelArr = [];


const init = () => {


  //let myTracker = new tracking.Tracker('target');
  let classes = document.querySelector('.level').classList;
  let level = classes[1];

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

  for(let i = 0; i < settings.length; i++){

    if(settings[i].type === level){
        levelArr.push(settings[i]);
    }

  }

  let number = Math.floor((Math.random() * levelArr.length) + 0);

  let pickLevelFigure = levelArr[number];

  let setting = pickLevelFigure;

  let thisFigure = figure[setting.figure];
  createFixed(setting, thisFigure);

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

const createFixed = (setting, fig) => {

  let {amount} = setting;




  for(let i = 0; i < amount; i++){

     let position = {
      x: fig[i].x,
      y: fig[i].y,
      z: fig[i].z,
    };

    let torus = new Torus(position, setting.type);
    scene.add(torus.render());
    fixedArr.push(torus);

  }

};






const render = () => {
  //move();

  renderer.render(scene, camera);
  requestAnimationFrame(() => render());

};

init();


