'use strict';

import {settings, figure, sets} from './data/';
import {SoundUtil} from './modules/util/';
import {Player, BufferLoader} from './modules/sound/';
import Torus from './modules/render/Torus';
let Tracking = require('tracking/build/tracking.js');
let OrbitControls = require('three-orbit-controls')(THREE);
let TWEEN = require('tween.js');

//let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
//let context = canvas.getContext('2d');
let navigator = window.navigator;
let webcam = false;
let scene, camera, renderer, MovingCube, cloud;
let scalenr = 0.5;
let random;
let maximumCloudSize = 1.4;
let minimumCloudSize = 0.7;
let start = 0;
let y, sinus;
let musicInit = false;
let musicSpeed = 300;
let trackedColor = "none";
let tweenbool = false;
let levelInput;
let controlChoice;
let pannerVal = window.innerWidth/2;
let ctx;
let player;
let bounds;
let flyingval = 700;
let fireOnce = false;
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
let arrBufferSounds = [];
let FigureYpos = [];
let scale;
let thisFigure;
let ground;
let skyBox;
let boolMagentaAnim = true;
let boolYellowAnim = true;


let number = 1;

const init = () => {

  infoInteraction();

  scene = new THREE.Scene();

  ctx = new AudioContext();
  player = new Player(ctx);

  window.AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;

  bounds = {
    width: window.innerWidth,
    height: window.innerHeight,
    border: 80
  };

  pannerVal = bounds.width/2;

  let level = levelInput;

  let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  let VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0, 150, 400);
  camera.lookAt(scene.position);

  renderer = new THREE.WebGLRenderer({antialias: true});

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  let loaderMusic = new BufferLoader(ctx);
  loaderMusic.load(sets['audio'])
    .then( data => play(data) );

  document.querySelector('main').appendChild(renderer.domElement);

  renderer.shadowMapEnabled = true;
  renderer.shadowMapType = THREE.PCFSoftShadowMap;

  makeScene();

  var meshke = new THREE.MeshLambertMaterial( { color: '#f9f9f9', shading: THREE.FlatShading, overdraw: 0.5 } );
  var MovingCubeGeom = new THREE.CubeGeometry(10, 10, 10);
  MovingCube = new THREE.Mesh( MovingCubeGeom, meshke );

  for(let i = 0; i < settings.length; i++){
    if(settings[i].type === level){
      levelArr.push(settings[i]);
    }
  }

  let number = Math.floor((Math.random() * levelArr.length) + 0);
  let pickLevelFigure = levelArr[number];
  let setting = pickLevelFigure;

  thisFigure = figure[setting.figure];
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
      scene.add( MovingCube);
    }
  );

  /*var loaderPlanet = new THREE.JSONLoader();

  loaderPlanet.load(
   'assets/pannerVal.js',
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
      let planematerials = new THREE.MeshPhongMaterial( { color: '#8BAABE', shading: THREE.SmoothShading } );
      //var materialsss = new THREE.MeshFaceMaterial( materials );

      ground = new THREE.Mesh( geometry, planematerials );
      ground.position.set(0, -123, 0);
      scene.add( ground );
      ground.receiveShadow = true;

    }
  );


  if (controlChoice === 'keyboard') {
    animateKeyboard();
    $('#video').addClass('hidden');
    $('#canvas').addClass('hidden');
    $('.arrowcontrols').addClass('hidden');

  } else if (controlChoice === 'webcam') {

      checkWebcam();

      $('.infokeyboard').addClass('infowebcam');
      $('.infowebcam').removeClass('infokeyboard');



  }

  $('.backtohome').on('click', function(e){
    //e.preventDefault();
    //redirect('')
  });

  drawPath();
  //playMusic();


};

//--------------------------------------------------------------------------

const makeScene = () => {
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: '#000000', side: THREE.BackSide } );
  skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  scene.add(skyBox);
  scene.fog = new THREE.FogExp2( '#0d305b', 0.00019 );
  var hemiLight = new THREE.HemisphereLight( '#4c6286', '#4c6286', 0.6 );
//var hemiLight = new THREE.HemisphereLight( '#6b2365', '#6b2365', 0.6 );


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
  dirLight.shadowBias = -0.001;
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
  //console.log(setting, fig);
  let {amount} = setting;

  for(let i = 0; i < amount; i++){

    let position = {
      x: fig[i].x,
      y: fig[i].y,
      z: fig[i].z
    };

    let torus = new Torus(position, setting.type);
    scene.add(torus.render(0));
    collidableMeshList.push(torus);
    fixedArr.push(torus);
    checkCollisionArr.push(torus);

    FigureYpos.push(torus.position.y);


  }

};

const scaleCloud = () => {
  if(cloud && scale){

    scalenr+= 0.1;

    cloud.scale.x = scalenr;
    cloud.scale.y = scalenr;
    cloud.scale.z = scalenr;


    if(scalenr >= random){
      scalenr = 0;
      scale = false;
    }

  }
}

const checkWebcam = () => {

  navigator.mediaDevices.enumerateDevices().then(function(MediaDeviceInfo) {
    for(let i = 0; i < MediaDeviceInfo.length; i++){
      if(MediaDeviceInfo[i].kind === "videoinput"){
        webcam = true;

        let colors = new tracking.ColorTracker(['magenta', 'yellow']);

        tracking.track('#video', colors, { camera: true });
        colors.on('track', onColorMove);
        animateWebcam();
      }
    }

  });


};



const drawPath = () => {


  setTimeout(function () {


    let geometry = new THREE.IcosahedronGeometry(3, 0);

    var material = new THREE.MeshPhongMaterial( {color: '#E7FFFD', shading: THREE.FlatShading} );

    cloud = new THREE.Mesh( geometry, material );
    cloud.castShadow = true;
    cloud.receiveShadow = true;
    cloud.position.set(MovingCube.position.x + 4, MovingCube.position.y, MovingCube.position.z + 3);


    if(trackedColor !== "none"){
      if(trackedColor === "yellow"){
        cloud.material = new THREE.MeshPhongMaterial( {color: '#f3e50b', shading: THREE.FlatShading} );
      }
      if(trackedColor === "magenta"){
        cloud.material = new THREE.MeshPhongMaterial( {color: '#eb4e8d', shading: THREE.FlatShading} );
      }
    }


    scale = true;
    random = Math.random() * (maximumCloudSize - minimumCloudSize) + minimumCloudSize;

    scene.add( cloud );

    drawPath();
  }, 1000);
};



const playMusic = () => {
  setTimeout(function () {


//  navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(mediaStream) { console.log("yes: ", mediaStream);});

    if(musicInit){
          player.play();
    }

    playMusic();
  }, musicSpeed);
};

//-----------------------------------------------------------------------
const animateKeyboard = () => {
  requestAnimationFrame(() => animateKeyboard());
  TWEEN.update();
  renderKeyboard();
};
//-----------------------------------------------------------------------
const renderKeyboard = () => {
  update();
  scaleCloud();
  moveTorus();

  updateForKeyboard();
//  TWEEN.update();
  renderer.render(scene, camera);
};

const moveTorus = () => {

  sinus = Math.sin( start ) + 10
  start += 0.05;

  for(let i = 0; i < fixedArr.length; i++){
    let nr = i * 0.5 + 1;
    fixedArr[i].shape.position.y = ((FigureYpos[i] + sinus * nr));
  }
};


//-----------------------------------------------------------------------
const animateWebcam = () => {
  if(webcam === false){
    animateKeyboard();
  }
  requestAnimationFrame(() => animateWebcam());
  renderWebcam();

};
//-----------------------------------------------------------------------
const renderWebcam = () => {
  update();
  scaleCloud();
  TWEEN.update();
  renderer.render(scene, camera);
};

const fireTweenMagenta = () => {
  let tween = new TWEEN.Tween(ground.material.color)
      .to({r: 0.6, g: 0.2, b: 0.2}, 900)
      .easing(TWEEN.Easing.Quartic.Out)
      .start()

  let tween2 = new TWEEN.Tween(skyBox.material.color)
      .to({r: 0.6, g: 0.2, b: 0.2}, 1400)
      .easing(TWEEN.Easing.Quartic.Out)
      .start()

    boolMagentaAnim = false;
};

const fireTweenYellow = () => {
  let tween = new TWEEN.Tween(ground.material.color)
      .to({r: 0.1, g: 0.4, b: 0.7}, 900)
      .easing(TWEEN.Easing.Quartic.Out)
      .start()

  let tween2 = new TWEEN.Tween(skyBox.material.color)
      .to({r: 0.5, g: 0.6, b: 0.9}, 1400)
      .easing(TWEEN.Easing.Quartic.Out)
      .start()

    boolYellowAnim = false;
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
  } else {

    trackedColor = event.data[0].color;
  //console.log(ground.material.color);
    if (trackedColor === "magenta") {
      boolYellowAnim = true;
      if (boolMagentaAnim) {
        fireTweenMagenta();
      }
    }else if (trackedColor === "yellow") {
      boolMagentaAnim = true;
      if (boolYellowAnim) {
        fireTweenYellow();
      }
    }

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
    }else if (maxRect.x >= 200) {
      rotateLEFT = true;
      rotateRIGHT = false;
    }else if (maxRect.x >= 90 && maxRect.x < 200){
      rotateLEFT = false;
      rotateRIGHT = false;
    }

    if (maxRect.y < 50) {
      rotateUP = true;
      rotateDOWN = false;
    }else if (maxRect.y >= 150) {
      rotateDOWN = true;
      rotateUP = false;
    }else if (maxRect.y >= 50 && maxRect.y < 150){
      rotateDOWN = false;
      rotateUP = false;
    }

  }

};



//-----------------------------------------------------------------------
const update = () => {

  if (fixedArr.length !== 0) {
    if (movingUP || movingDOWN || movingLEFT || movingRIGHT || rotateUP || rotateDOWN || rotateLEFT || rotateRIGHT ) {
      checkCollision();
      //console.log("start");
      if (player.gainNode.gain.value < 1) {
          //console.log('in gank schieten eh!');
        player.gainNode.gain.value += 0.04;
      }
    }else {
      if (player.gainNode.gain.value > 0.2) {
        //console.log('stilvallen');
        player.gainNode.gain.value -= 0.03;
      }
    }


  }

  var rotation_matrix = new THREE.Matrix4().identity();

  if (movingUP) {
    MovingCube.translateZ(-0.8);
  };
  if (movingDOWN){
     MovingCube.translateZ(0.9);
  }
  if (movingLEFT) MovingCube.translateX(-0.9);
  if (movingRIGHT) MovingCube.translateX(0.9);
  if (rotateUP) {
    MovingCube.rotateOnAxis( new THREE.Vector3(1, 0, 0), 0.009);
    if(musicSpeed >= 150){
      musicSpeed -= 20;
    }
  };
  if (rotateDOWN){
    MovingCube.rotateOnAxis( new THREE.Vector3(1, 0, 0), -0.009);
     if(musicSpeed <= 533){
      musicSpeed += 20;
    }

  }
  if (rotateLEFT) {
    MovingCube.rotateOnAxis( new THREE.Vector3(0, 1, 0), 0.009);
    //pannerVal = (window.innerWidth/4);


    if (pannerVal >= (window.innerWidth/7)) {
      pannerVal -= 4;
    }

  }else if (rotateRIGHT) {
    MovingCube.rotateOnAxis( new THREE.Vector3(0, 1, 0), -0.009);
    //pannerVal = window.innerWidth-(window.innerWidth/4);
    if (pannerVal <= window.innerWidth-(window.innerWidth/7)) {
       pannerVal += 4;
    };

  } else {
    //pannerVal = window.innerWidth/2;
    if (pannerVal < (window.innerWidth/2-3)) {
      pannerVal +=7;
    } else if (pannerVal > (window.innerWidth/2+3)) {
      pannerVal -=7;
    }
  }

  if (checkCollisionArr.length != 0) {
    var relativeCameraOffset = new THREE.Vector3(0, 50, 200);
    var cameraOffset = relativeCameraOffset.applyMatrix4( MovingCube.matrixWorld );
    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt( MovingCube.position );
  } else {

    if(!tweenbool){
      fireTween();
    }


  }

  //console.log("pannerpannerVal -> ", pannerVal);
  player.panner.setPosition(SoundUtil.getPanning(bounds, pannerVal), 0, 1 - Math.abs(SoundUtil.getPanning(bounds, pannerVal)));


};

const fireTween = () => {

  var material = new THREE.LineBasicMaterial({
        color: 0xf9f9f9,
        linewidth: 4,
        fog: true
    });
  //console.log("fig: ",thisFigure);

  var geometry = new THREE.Geometry();
  for(let i = 0; i < thisFigure.length; i++){
    geometry.vertices.push(new THREE.Vector3(thisFigure[i].x, thisFigure[i].y, thisFigure[i].z+20));
    if (i == thisFigure.length-1) {
      geometry.vertices.push(new THREE.Vector3(thisFigure[0].x, thisFigure[0].y, thisFigure[0].z+20));
    }
  }


    var line = new THREE.Line(geometry, material);

    scene.add(line);
    renderer.render(scene, camera);


       let t0 = new TWEEN.Tween(camera.position)
            .to({ x: 110,
                  y: 180,
                  z: 730
            }, 2000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function() {
              camera.lookAt(fixedArr[0].position);
              scene.remove(MovingCube);

            })
            .onComplete(function() {
              $('.backtohome').removeClass('hidden');

              new OrbitControls(camera);

            });

          t0.start();



          let t1 = new TWEEN.Tween(MovingCube.position)
            .to({ x: fixedArr[1].position.x+60,
                  y: fixedArr[1].position.y,
                  z: fixedArr[1].position.z
            }, 2000)
            .delay(1000)
            .easing(TWEEN.Easing.Linear.None);



          t1.start();



          tweenbool = true;


};




const updateForKeyboard = () => {

  document.addEventListener('keyup', function(event){

    if(event.keyCode === 90){ //W UP
      movingUP = false;
    }else if(event.keyCode === 87){ // DOWN
      movingDOWN = false;
    }else if(event.keyCode === 81){ //Q LEFT
      movingLEFT = false;
    }else if(event.keyCode === 68){ //D RIGHT
      movingRIGHT = false;
    }

    if(event.keyCode === 38){ // UP
      rotateUP = false;
    }else if(event.keyCode === 40){ // DOWN
      rotateDOWN = false;
    }else if(event.keyCode === 37){ // LEFT
      rotateLEFT = false;
    }else if(event.keyCode === 39){ // RIGHT
      rotateRIGHT = false;
    }

  });

  document.addEventListener('keydown', function(event){
    if(event.keyCode === 90){ //W UP
      movingUP = true;
    }else if(event.keyCode === 87){ // DOWN
      movingDOWN = true;
    }else if(event.keyCode === 81){ //Q LEFT
      movingLEFT = true;
    }else if(event.keyCode === 68){ //D RIGHT
      movingRIGHT = true;
    }

    if(event.keyCode === 38){ // UP
      rotateUP = true;
    }else if(event.keyCode === 40){ // DOWN
      rotateDOWN = true;
    }else if(event.keyCode === 37){ // LEFT
      rotateLEFT = true;
    }else if(event.keyCode === 39){ // RIGHT
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
    number++;
    if (checkCollisionArr[i].position.x.between(MovingCube.position.x-22, MovingCube.position.x+22) &&
        checkCollisionArr[i].position.y.between(MovingCube.position.y-35, MovingCube.position.y+35) &&
        checkCollisionArr[i].position.z.between(MovingCube.position.z-22, MovingCube.position.z+22)
      ) {
     // player.playSoundtrack(arrBufferSounds[1], SoundUtil.getPanning(bounds, flyingval));
      checkCollisionArr[i].shape.material.color.setHex(0xff0000);
      checkCollisionArr.splice(i, 1);
    }
    if (checkCollisionArr.length === 0) {
      //console.log("--- DONE ---");

    }
  }
};

//-----------------------------------------------------------------------

const play = (data=[]) => {
  arrBufferSounds = data;
  player.playSoundtrack(data[2], 3);
  playMusic();
  musicInit = true;
  data.forEach(function(s) {
    arrBufferSounds.push(s);
  });
};

//-----------------------------------------------------------------------
const infoInteraction = () => {
  $('.infobtn').on('click', function(e){
    $('.info').toggleClass( 'hidden' );
  });
};

//-----------------------------------------------

$.getJSON( 'api/level')
  .done(function( data ) {
    levelInput = data.level;
    controlChoice = data.playmode;
    init();
  })
  .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ', ' + error;
  });


//---------------------------------------------->END
