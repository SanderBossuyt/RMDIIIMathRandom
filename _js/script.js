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
let scene, camera, renderer, MovingCube;
let clock = new THREE.Clock();
var velocity = new THREE.Vector3();

let movingUP = false;
let movingDOWN = false;
let movingLEFT = false;
let movingRIGHT = false;

let rotateUP = false;
let rotateDOWN = false;
let rotateLEFT = false;
let rotateRIGHT = false;

let fixedArr = [];
let levelArr = [];


const init = () => {

scene = new THREE.Scene();
  //let myTracker = new tracking.Tracker('target');
  let classes = document.querySelector('.level').classList;
  let level = classes[1];






  console.log(helloworldTpl({name: 'Bossuyt Sander & Verheye Lieselot'}));
  /*scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );
  camera.position.x = 100;
  camera.position.y = 100;
  camera.position.z = 200;
  renderer = new THREE.WebGLRenderer();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );*/



let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  let VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0, 150, 400);
  camera.lookAt(scene.position);



  renderer = new THREE.WebGLRenderer();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
  //console.log(OrbitControls);
  new OrbitControls(camera);
  document.querySelector('main').appendChild(renderer.domElement);


// must enable shadows on the renderer
  renderer.shadowMapEnabled = true;

  // "shadow cameras" show the light source and direction
// SKYBOX/FOG
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: '#000000', side: THREE.BackSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
scene.add(skyBox);
  scene.fog = new THREE.FogExp2( '#0d305b', 0.00025 );
// Set the background color of the scene.
    //renderer.setClearColorHex(0x333F47, 1);

    // Create a light, set its position, and add it to the scene.

  // spotlight #1 -- yellow, dark shadow
  /*var spotlight = new THREE.SpotLight(0xffff00);
  spotlight.position.set(-60,150,-30);
  spotlight.shadowCameraVisible = true;
  spotlight.shadowDarkness = 0.95;
  spotlight.intensity = 2;
  // must enable shadow casting ability for the light
  spotlight.castShadow = true;
  scene.add(spotlight);
  // spotlight #2 -- red, light shadow
  var spotlight2 = new THREE.SpotLight(0xff0000);
  spotlight2.position.set(60,150,-60);
  scene.add(spotlight2);
  spotlight2.shadowCameraVisible = true;
  spotlight2.shadowDarkness = 0.70;
  spotlight2.intensity = 2;
  spotlight2.castShadow = true;

  // spotlight #3
  var spotlight3 = new THREE.SpotLight(0x0000ff);
  spotlight3.position.set(150,80,-100);
  spotlight3.shadowCameraVisible = true;
  spotlight3.shadowDarkness = 0.95;
  spotlight3.intensity = 2;
  spotlight3.castShadow = true;
  scene.add(spotlight3);
  // change the direction this spotlight is facing
  var lightTarget = new THREE.Object3D();
  lightTarget.position.set(0,40,0);
  scene.add(lightTarget);
  spotlight3.target = lightTarget;*/



  let material = new THREE.MeshBasicMaterial({
    color: '#ff2354',
    wireframe: false
  });



/*var texture = THREE.ImageUtils.loadTexture( '../public/assets/checkerboard.jpg' );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 40, 40 );
var floorMaterial = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneGeometry(200, 200, 1, 1);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);*/



var MovingCubeGeom = new THREE.CubeGeometry(10, 10, 10);
  MovingCube = new THREE.Mesh( MovingCubeGeom, material );
  MovingCube.position.set(0, 25.1, 0);
  MovingCube.castShadow = true;
  scene.add(MovingCube);

  animate();














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
  //new OrbitControls(camera);
  //document.querySelector('main').appendChild(renderer.domElement);


  //box();
  //spheres = createSpheres(50);
  /*var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var cube = new THREE.Mesh( geometry, material );*/

  /*let geometry = new THREE.SphereGeometry(20, 10, 10);
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
  scene.add(floor);*/













  //render();
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






/*const render = () => {
  //move();

  renderer.render(scene, camera);
  requestAnimationFrame(() => render());

};*/


const render = () => {
  update();
  renderer.render(scene, camera);
}

const animate = () => {
  requestAnimationFrame(() => animate());
  render();
}

const update = () => {

  var delta = clock.getDelta(); // seconds.
  var moveDistance = 0.2 * delta; // 200 pixels per second
  var rotateAngle = Math.PI / 170 * delta;   // pi/2 radians (90 degrees) per second

var rotation_matrix = new THREE.Matrix4().identity();

if (movingUP) {
  MovingCube.translateZ(-2);
};

if (movingDOWN) {
  MovingCube.translateZ(2);
};

if (movingLEFT) {
  MovingCube.translateX(-2);
};

if (movingRIGHT) {
  MovingCube.translateX(2);
};

if (rotateUP) {
  MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), 0.009);
};

if (rotateDOWN) {
  MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), -0.009);
};

if (rotateLEFT) {
  MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), 0.009);
};

if (rotateRIGHT) {
  MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), -0.009);
};


  document.addEventListener('keyup', function(event) {

    if(event.keyCode == 90) { //W UP
     //MovingCube.translateZ(-moveDistance);
     movingUP = false;
    }
    else if(event.keyCode == 87) { // DOWN
      //MovingCube.translateZ(moveDistance);
      movingDOWN = false;
    }
    else if(event.keyCode == 81) { //Q LEFT
      //MovingCube.translateX(-moveDistance);
      movingLEFT = false;
    }
    else if(event.keyCode == 68) { //D RIGHT
      //MovingCube.translateX(moveDistance);
      movingRIGHT = false;
    }

    if(event.keyCode == 38) { // UP
      //MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
      rotateUP = false;
    }
    else if(event.keyCode == 40) { // DOWN
      //MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
      rotateDOWN = false;
    }
    else if(event.keyCode == 37) { // LEFT
      //MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
      rotateLEFT = false;
    }
    else if(event.keyCode == 39) { // RIGHT
      //MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
      rotateRIGHT = false;
    }

  });

  document.addEventListener('keydown', function(event) {
    if(event.keyCode == 90) { //W UP
     //MovingCube.translateZ(-moveDistance);
     movingUP = true;
    }
    else if(event.keyCode == 87) { // DOWN
      //MovingCube.translateZ(moveDistance);
      movingDOWN = true;
    }
    else if(event.keyCode == 81) { //Q LEFT
      //MovingCube.translateX(-moveDistance);
      movingLEFT = true;
    }
    else if(event.keyCode == 68) { //D RIGHT
      //MovingCube.translateX(moveDistance);
      movingRIGHT = true;
    }

    if(event.keyCode == 38) { // UP
      //MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
      rotateUP = true;
    }
    else if(event.keyCode == 40) { // DOWN
      //MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
      rotateDOWN = true;
    }
    else if(event.keyCode == 37) { // LEFT
      //MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
      rotateLEFT = true;
    }
    else if(event.keyCode == 39) { // RIGHT
      //MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
      rotateRIGHT = true;
    }

    if(event.keyCode == 82){
      MovingCube.position.set(0,25.1,0);
    MovingCube.rotation.set(0,0,0);
    }
});

  var relativeCameraOffset = new THREE.Vector3(0, 50, 200);
  var cameraOffset = relativeCameraOffset.applyMatrix4( MovingCube.matrixWorld );
  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;
  camera.lookAt( MovingCube.position );
}


init();


