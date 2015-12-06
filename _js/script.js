'use strict';

import {settings, figure} from './data/';
import helloworldTpl from '../_hbs/helloworld';
import Torus from './modules/render/Torus';
let Tracking = require('tracking/build/tracking.js');
let OrbitControls = require('three-orbit-controls')(THREE);

let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let scene, camera, renderer, MovingCube;

let levelInput;
let controlChoice;

let movingUP = false;
let movingDOWN = false;
let movingLEFT = false;
let movingRIGHT = false;
let rotateUP = false;
let rotateDOWN = false;
let rotateLEFT = false;
let rotateRIGHT = false;

let fixedArr = [];
let checkCollisionArr = [];
let levelArr = [];
let collidableMeshList = [];

let number = 1;


const init = () => {

  //when clicking the info button, show/hide the controls
  infoInteraction();

  scene = new THREE.Scene();

  let level = levelInput;

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

  /*new OrbitControls(camera);*/
  document.querySelector('main').appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  makeScene();

  var meshke = new THREE.MeshLambertMaterial( { color: '#f9f9f9', shading: THREE.FlatShading, overdraw: 0.5 } );
  var MovingCubeGeom = new THREE.CubeGeometry(10, 10, 10);
  MovingCube = new THREE.Mesh( MovingCubeGeom, meshke );

  for(let i = 0; i < settings.length; i++){
    if(settings[i].type === level){
      console.log(settings[i]);
      levelArr.push(settings[i]);
    }
  }

  let number = Math.floor((Math.random() * levelArr.length) + 0);
  let pickLevelFigure = levelArr[number];
  let setting = pickLevelFigure;

  let thisFigure = figure[setting.figure];
  createFixed(setting, thisFigure);


  var loader = new THREE.JSONLoader();

  loader.load(
   'assets/final.js',
    function(geometry, materials){
       var materialsss = new THREE.MeshFaceMaterial( materials );
      MovingCube = new THREE.Mesh( geometry, materialsss );
      MovingCube.position.set(0, 25.1, 0);
      MovingCube.castShadow = true;
      MovingCube.receiveShadow = true;
      //console.log("t: ",MovingCube);
      scene.add( MovingCube);
    }
  );

  /*var loaderPlanet = new THREE.JSONLoader();

  loaderPlanet.load(
   'assets/bam.js',
    function(geometry, materials){
      let materialss = new THREE.MeshBasicMaterial( { color: '#D74C4F' } );
       var material = new THREE.MeshFaceMaterial( materials );
      var planet = new THREE.Mesh( geometry, materialss );
      planet.position.set(0, 0, 0);
      planet.castShadow = true;
      planet.receiveShadow = true;
      //console.log("t: ",planet);
      scene.add( planet);
    }
  );*/

  var loaderPlane = new THREE.JSONLoader();

  loaderPlane.load(
   'assets/plane.js',
    function(geometry, materials){
      let materialss = new THREE.MeshBasicMaterial( { color: '#8BAABE' } );
       //var material = new THREE.MeshFaceMaterial( materials );
      /*MovingCube = new THREE.Mesh( geometry, material );
      MovingCube.position.set(0, 25.1, 0);
      MovingCube.castShadow = true;
      MovingCube.receiveShadow = true;
      //console.log("t: ",MovingCube);
      scene.add( MovingCube);*/

  var ground = new THREE.Mesh( geometry, materialss );
  //ground.rotation.x = -Math.PI/2;
  //ground.position.y = -33;
  ground.position.set(0, -123, 0);
  scene.add( ground );
  ground.receiveShadow = true;

    }
  );


  if (controlChoice == 'keyboard') {
    animateKeyboard();
    $('#video').addClass("hidden");
    $('#canvas').addClass('hidden');
    $('.arrowcontrols').addClass('hidden');

  } else if (controlChoice == 'webcam') {
    $('.infokeyboard').addClass('infowebcam');
    $('.infowebcam').removeClass('infokeyboard');
    var colors = new tracking.ColorTracker(['magenta']);
    tracking.track('#video', colors, { camera: true });
    colors.on('track', onColorMove);
    animateWebcam();
  }


};

//--------------------------------------------------------------------------

const makeScene = () => {
  // SKYBOX/FOG
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: '#000000', side: THREE.BackSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  scene.add(skyBox);
  scene.fog = new THREE.FogExp2( '#0d305b', 0.00019 );
  // LIGHTS
  var hemiLight = new THREE.HemisphereLight( '#4c6286', '#4c6286', 0.6 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );


  var dirLight = new THREE.DirectionalLight( '#4c6286', 1 );
  dirLight.color.setHSL( 0.1, 1, 0.75 );
  dirLight.position.set( -1, 1.5, 1 );
  dirLight.position.multiplyScalar( 50 );
  scene.add( dirLight );
  dirLight.castShadow = true;
  dirLight.shadowMapWidth = 2048;
  dirLight.shadowMapHeight = 2048;

  var d = 90;
  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCameraTop = d;
  dirLight.shadowCameraBottom = -d;
  dirLight.shadowCameraFar = 3500;
  dirLight.shadowBias = -0.0001;

  var particle, e;
  for ( var zpos = -1000; zpos < 800; zpos+=2 ) {
    particle = new THREE.Particle(e);
    particle.position.x = Math.random() * 6000 - 3000;
    particle.position.y = Math.random() * 6000 - 3000;
    particle.position.z = zpos;
    particle.scale.x = particle.scale.y = 1.6;
    scene.add( particle );
  }
};



//-----------------------------------------------------------------------
const createFixed = (setting, fig) => {
  console.log(setting, fig);
  let {amount} = setting;

  for(let i = 0; i < amount; i++){

    let position = {
      x: fig[i].x,
      y: fig[i].y,
      z: fig[i].z
    };

    let torus = new Torus(position, setting.type);
    console.log(torus);
    scene.add(torus.render());
    collidableMeshList.push(torus);
    fixedArr.push(torus);
    checkCollisionArr.push(torus);

  }

};


//-----------------------------------------------------------------------
const animateKeyboard = () => {
  requestAnimationFrame(() => animateKeyboard());
  renderKeyboard();
};
//-----------------------------------------------------------------------
const renderKeyboard = () => {
  update();
  updateForKeyboard();
  renderer.render(scene, camera);
};



//-----------------------------------------------------------------------
const animateWebcam = () => {
  requestAnimationFrame(() => animateWebcam());
  renderWebcam();
};
//-----------------------------------------------------------------------
const renderWebcam = () => {
  update();
  renderer.render(scene, camera);
};


//-----------------------------------------------------------------------
const onColorMove = (event) => {
  if (event.data.length === 0) {
    movingUP = false;
    movingDOWN = false;
    movingLEFT = false;
    movingRIGHT = false;
    rotateUP = false;
    rotateDOWN = false;
    rotateLEFT = false;
    rotateRIGHT = false;
    return;
  }

  var maxRect;
  var maxRectArea = 0;
  var rectWidth, rectHeight;

  event.data.forEach(function(rect) {
    if (rect.width * rect.height > maxRectArea){
      maxRectArea = rect.width * rect.height;
      maxRect = rect;
    }
  });

  if (maxRectArea > 0) {
    var rectCenterX = maxRect.x + (maxRect.width/2);
    var rectCenterY = maxRect.y + (maxRect.height/2);

    movingUP = true;

    if (maxRect.x < 90) {
      rotateRIGHT = true;
      rotateLEFT = false;
      //movingUP = false;
    }else if (maxRect.x >= 200) {
      rotateLEFT = true;
      rotateRIGHT = false;
      //movingUP = false;
    }else if (maxRect.x >= 90 && maxRect.x < 200){
      rotateLEFT = false;
      rotateRIGHT = false;
      //movingUP = false;
    }

    if (maxRect.y < 50) {
      rotateUP = true;
      rotateDOWN = false;
      //movingUP = false;
    }else if (maxRect.y >= 150) {
      rotateDOWN = true;
      rotateUP = false;
      //movingUP = false;
    }else if (maxRect.y >= 50 && maxRect.y < 150){
      rotateDOWN = false;
      rotateUP = false;
      //movingUP = false;
    }

    /*if(maxRect.y < 40){
      if (maxRect.x < 70) {
        rotateRIGHT = true;
      }else {
        rotateRIGHT = false;
      }

      if(maxRect.x >=230){
        rotateLEFT = true;
      } else {
        rotateLEFT = false;
      }
    } else if(maxRect.y >= 40 && maxRect.y < 170){
      if (maxRect.x < 70) {
        rotateRIGHT = true;
      }else {
        rotateRIGHT = false;
      }

      if(maxRect.x >=230){
        rotateLEFT = true;
      } else {
        rotateLEFT = false;
      }
    }*/


  }

};



//-----------------------------------------------------------------------
const update = () => {

  if (fixedArr.length !== 0) {
    if (movingUP || movingDOWN || movingLEFT || movingRIGHT || rotateUP || rotateDOWN || rotateLEFT || rotateRIGHT ) {
      checkCollision();
    }
  }

  var rotation_matrix = new THREE.Matrix4().identity();

  if (movingUP) MovingCube.translateZ(-0.3);
  if (movingDOWN) MovingCube.translateZ(0.9);
  if (movingLEFT) MovingCube.translateX(-0.9);
  if (movingRIGHT) MovingCube.translateX(0.9);
  if (rotateUP) MovingCube.rotateOnAxis( new THREE.Vector3(1, 0, 0), 0.008);
  if (rotateDOWN) MovingCube.rotateOnAxis( new THREE.Vector3(1, 0, 0), -0.008);
  if (rotateLEFT) MovingCube.rotateOnAxis( new THREE.Vector3(0, 1, 0), 0.008);
  if (rotateRIGHT) MovingCube.rotateOnAxis( new THREE.Vector3(0, 1, 0), -0.008);


  var relativeCameraOffset = new THREE.Vector3(0, 50, 200);
  var cameraOffset = relativeCameraOffset.applyMatrix4( MovingCube.matrixWorld );
  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;
  camera.lookAt( MovingCube.position );


};


const updateForKeyboard = () => {

document.addEventListener('keyup', function(event){

    if(event.keyCode === 90){ //W UP
     //MovingCube.translateZ(-moveDistance);
      movingUP = false;
    }else if(event.keyCode === 87){ // DOWN
      //MovingCube.translateZ(moveDistance);
      movingDOWN = false;
    }else if(event.keyCode === 81){ //Q LEFT
      //MovingCube.translateX(-moveDistance);
      movingLEFT = false;
    }else if(event.keyCode === 68){ //D RIGHT
      //MovingCube.translateX(moveDistance);
      movingRIGHT = false;
    }

    if(event.keyCode === 38){ // UP
      //MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
      rotateUP = false;
    }else if(event.keyCode === 40){ // DOWN
      //MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
      rotateDOWN = false;
    }else if(event.keyCode === 37){ // LEFT
      //MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
      rotateLEFT = false;
    }else if(event.keyCode === 39){ // RIGHT
      //MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
      rotateRIGHT = false;
    }

  });

  document.addEventListener('keydown', function(event){
    if(event.keyCode === 90){ //W UP
     //MovingCube.translateZ(-moveDistance);
      movingUP = true;
    }else if(event.keyCode === 87){ // DOWN
      //MovingCube.translateZ(moveDistance);
      movingDOWN = true;
    }else if(event.keyCode === 81){ //Q LEFT
      //MovingCube.translateX(-moveDistance);
      movingLEFT = true;
    }else if(event.keyCode === 68){ //D RIGHT
      //MovingCube.translateX(moveDistance);
      movingRIGHT = true;
    }

    if(event.keyCode === 38){ // UP
      //MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
      rotateUP = true;
    }else if(event.keyCode === 40){ // DOWN
      //MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
      rotateDOWN = true;
    }else if(event.keyCode === 37){ // LEFT
      //MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
      rotateLEFT = true;
    }else if(event.keyCode === 39){ // RIGHT
      //MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
      rotateRIGHT = true;
    }

    if(event.keyCode === 82){
      MovingCube.position.set(0, 25.1, 0);
      MovingCube.rotation.set(0, 0, 0);
    }
  });
};




//---------------between function for collision check--------------------
Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
  max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};

//-----------------------------------------------------------------------
const checkCollision = () => {
  for(let i = 0; i < checkCollisionArr.length; i++){
    //console.log(number);
    //console.log(checkCollisionArr);
    number++;
    if (checkCollisionArr[i].position.x.between(MovingCube.position.x-17, MovingCube.position.x+17) &&
        checkCollisionArr[i].position.y.between(MovingCube.position.y-17, MovingCube.position.y+17) &&
        checkCollisionArr[i].position.z.between(MovingCube.position.z-17, MovingCube.position.z+17)
      ) {
      //console.log(checkCollisionArr[i]);

      scene.add(checkCollisionArr[i].renderSucceed());
      checkCollisionArr.splice(i, 1);
    }
  }
};

//-----------------------------------------------------------------------
const infoInteraction = () => {
  $('.infobtn').on('click', function(e){
    //console.log('clicked');
    $('.info').toggleClass( 'hidden' );
  });
};

//-----------------------------------------------

$.getJSON( 'api/level')
  .done(function( data ) {
    //console.log('level:', data.level, '  playmode:', data.playmode);
    levelInput = data.level;
    controlChoice = data.playmode;

    init();

  })
  .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ', ' + error;
    //console.log( 'Request Failed: ' + err );
  });


//---------------------------------------------->END

