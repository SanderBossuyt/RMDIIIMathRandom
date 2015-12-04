'use strict';

import {settings, figure} from './data/';
import helloworldTpl from '../_hbs/helloworld';
import Torus from './modules/render/Torus';
var Tracking = require('tracking/build/tracking.js');
let OrbitControls = require('three-orbit-controls')(THREE);

var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

let scene, camera, renderer, MovingCube;
let clock = new THREE.Clock();
let levelInput;

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
var collidableMeshList = [];


const init = () => {



  scene = new THREE.Scene();

  console.log(levelInput);

  let level = levelInput;



  var colors = new tracking.ColorTracker(['magenta']);
  tracking.track('#video', colors, { camera: true });
  colors.on('track', onColorMove);

  //console.log(helloworldTpl({name: 'Bossuyt Sander & Verheye Lieselot'}));

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

  console.log()

  new OrbitControls(camera);
  document.querySelector('main').appendChild(renderer.domElement);

// must enable shadows on the renderer
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // "shadow cameras" show the light source and direction
// SKYBOX/FOG
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: '#000000', side: THREE.BackSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  scene.add(skyBox);
  scene.fog = new THREE.FogExp2( '#0d305b', 0.00025 );
// LIGHTS
  var hemiLight = new THREE.HemisphereLight( '#4c6286', '#4c6286', 0.6 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );
  var dirLight = new THREE.DirectionalLight( '#4c6286', 1 );
  dirLight.color.setHSL( 0.1, 1, 0.75 );
  dirLight.position.set( -1, 1.75, 1 );
  dirLight.position.multiplyScalar( 50 );
  scene.add( dirLight );
  dirLight.castShadow = true;
  dirLight.shadowMapWidth = 2048;
  dirLight.shadowMapHeight = 2048;
  var d = 50;
  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCameraTop = d;
  dirLight.shadowCameraBottom = -d;
  dirLight.shadowCameraFar = 3500;
  dirLight.shadowBias = -0.0001;
  //dirLight.shadowCameraVisible = true;
  // GROUND
  var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
  var groundMat = new THREE.MeshPhongMaterial( { color: '#283c5d', specular: '#4c6286' } );
  //groundMat.color.setHSL( 0.03, 1, 0.75 );
  var ground = new THREE.Mesh( groundGeo, groundMat );
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -33;
  scene.add( ground );
  ground.receiveShadow = true;
  //MovingCube
  var meshke = new THREE.MeshLambertMaterial( { color: '#f9f9f9', shading: THREE.FlatShading, overdraw: 0.5 } );
  var MovingCubeGeom = new THREE.CubeGeometry(10, 10, 10);
  MovingCube = new THREE.Mesh( MovingCubeGeom, meshke );
  MovingCube.position.set(0, 25.1, 0);
  MovingCube.castShadow = true;
  MovingCube.receiveShadow = true;
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

    var loader = new THREE.JSONLoader();

loader.load(
  'assets/platonic2.js',
  function ( geometry, materials ) {
    var material = new THREE.MeshFaceMaterial( materials );
    MovingCube = new THREE.Mesh( geometry, material );
    MovingCube.position.set(0, 25.1, 0);
    MovingCube.castShadow = true;
    MovingCube.receiveShadow = true;
    scene.add( MovingCube );
  }
);




};




//-----------------------------------------------------------------------
const createFixed = (setting, fig) => {

  let {amount} = setting;

  for(let i = 0; i < amount; i++){

    let position = {
      x: fig[i].x,
      y: fig[i].y,
      z: fig[i].z
    };

    let torus = new Torus(position, setting.type);

    scene.add(torus.render());
    collidableMeshList.push(torus);
    fixedArr.push(torus);

  }

};

//-----------------------------------------------------------------------
const render = () => {
  update();
  renderer.render(scene, camera);
};

//-----------------------------------------------------------------------
const animate = () => {
  requestAnimationFrame(() => animate());
  render();
};

//-----------------------------------------------------------------------
const onColorMove = (event) => {
  if (event.data.length === 0) {
    /*movingUP = false;
    movingDOWN = false;
    movingLEFT = false;
    movingRIGHT = false;
    rotateUP = false;
    rotateDOWN = false;
    rotateLEFT = false;
    rotateRIGHT = false;*/
    return;
  }

  var maxRect;
  var maxRectArea = 0;
  var rectWidth, rectHeight;

  event.data.forEach(function(rect) {
        console.log(rect.width, rect.height);
        if (rect.width * rect.height > maxRectArea){
          maxRectArea = rect.width * rect.height;
          rectWidth = rect.width;
          rectHeight = rect.height;
          maxRect = rect;
        }
      });
      if (maxRectArea > 0) {
        var rectCenterX = maxRect.x + (maxRect.width/2);
        var rectCenterY = maxRect.y + (maxRect.height/2);




        if (rectWidth < 45) {
          rotateUP = false;
          rotateDOWN = true;
        }else if (rectHeight >= 150){
          rotateDOWN = false;
          rotateUP = true;
        }else if (rectWidth >= 45 && rectHeight <150){
          rotateDOWN = false;
          rotateUP = false;
        }



        //console.log(maxRect.x, maxRect.y);
        // maxrect.x gaat van 0 tot 300 in spiegelbeeld
        // -> van 0 tot 150 naar links (spiegelbeeld = rechts)
        // -> van 150 tot 300 naar rechts (spiegelbeeld = links)


        if (maxRect.x < 70) {
          movingRIGHT = true;
          movingLEFT = false;
        }else if (maxRect.x >= 230) {
          movingLEFT = true;
          movingRIGHT = false;
        }else if (maxRect.x >= 70 && maxRect.x < 230){
          movingLEFT = false;
          movingRIGHT = false;
        }

        // maxrect.x gaat van 0 tot 300 in spiegelbeeld
        // -> van 0 tot 150 naar links (spiegelbeeld = rechts)
        // -> van 150 tot 300 naar rechts (spiegelbeeld = links)

        if (maxRect.y < 30) {
          movingUP = true;
          movingDOWN = false;
        }else if (maxRect.y >= 170) {
          movingDOWN = true;
          movingUP = false;
        }else if (maxRect.y >=30 && maxRect.y < 170){
          movingDOWN = false;
          movingUP = false;
        }

        //checks voor rotatie bij bewegingen - left right

        if(maxRect.y < 30){
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
        } else if(maxRect.y >= 30 && maxRect.y < 170){
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
        }







        //mouseX = (rectCenterX - 160) * (window.innerWidth/320) * 10;
        //mouseY = (rectCenterY - 120) * (window.innerHeight/240) * 10;
        /*context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = maxRect.color;
        context.strokeRect(maxRect.x, maxRect.y, maxRect.width, maxRect.height);
        context.font = '11px Helvetica';
        context.fillStyle = "#fff";
        context.fillText('x: ' + maxRect.x + 'px', maxRect.x + maxRect.width + 5, maxRect.y + 11);
        context.fillText('y: ' + maxRect.y + 'px', maxRect.x + maxRect.width + 5, maxRect.y + 22);*/
      }

};

//-----------------------------------------------------------------------
const update = () => {
  //console.log(fixedArr);
  if (fixedArr.length !== 0) {
    checkCollision();
  }


  //var delta = clock.getDelta();
  //var moveDistance = 0.2 * delta;
  //var rotateAngle = Math.PI / 170 * delta;   // pi/2 radians (90 degrees) per second
  var rotation_matrix = new THREE.Matrix4().identity();

  if (movingUP){
    MovingCube.translateZ(-0.9);
  }
  if (movingDOWN){
    MovingCube.translateZ(0.9);
  }
  if (movingLEFT){
    MovingCube.translateX(-0.9);
  }
  if (movingRIGHT){
    MovingCube.translateX(0.9);
  }
  if (rotateUP){
    MovingCube.rotateOnAxis( new THREE.Vector3(1, 0, 0), 0.006);
  }
  if (rotateDOWN){
    MovingCube.rotateOnAxis( new THREE.Vector3(1, 0, 0), -0.006);
  }
  if (rotateLEFT){
    MovingCube.rotateOnAxis( new THREE.Vector3(0, 1, 0), 0.006);
  }
  if (rotateRIGHT){
    MovingCube.rotateOnAxis( new THREE.Vector3(0, 1, 0), -0.006);
  }


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


  var relativeCameraOffset = new THREE.Vector3(0, 50, 200);
  var cameraOffset = relativeCameraOffset.applyMatrix4( MovingCube.matrixWorld );
  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;
  camera.lookAt( MovingCube.position );



/*var originPoint = MovingCube.position.clone();

for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++){
  var localVertex = MovingCube.geometry.vertices[vertexIndex].clone();
  var globalVertex = localVertex.applyMatrix4( MovingCube.matrix );
  var directionVector = globalVertex.sub( MovingCube.position );

  var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
  var collisionResults = ray.intersectObjects( collidableMeshList );
  //if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
    //appendText(" Hit ");
    //console.log("hit hit hit");
  //}

  }
*//*
  var originPoint = MovingCube.position.clone();


for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++)
  {
    var localVertex = MovingCube.geometry.vertices[vertexIndex].clone();
    var globalVertex = localVertex.applyMatrix4( MovingCube.matrix );
    var directionVector = globalVertex.sub( MovingCube.position );
    c
    var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
    var collisionResults = ray.intersectObjects( collidableMeshList );
    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
      appendText(" Hit ");
  }*/




};

//---------------between function for collision check--------------------
Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};

//-----------------------------------------------------------------------
const checkCollision = () => {
  //console.log("in checkCollision");
  for(let i = 0; i < fixedArr.length; i++){

    if (fixedArr[i].position.x.between(MovingCube.position.x-17, MovingCube.position.x+17) &&
        fixedArr[i].position.y.between(MovingCube.position.y-17, MovingCube.position.y+17) &&
        fixedArr[i].position.z.between(MovingCube.position.z-17, MovingCube.position.z+17)
      ) {
      //console.log(fixedArr[i]);

      scene.add(fixedArr[i].renderSucceed());
    }
  }
};

//-----------------------------------------------

 $.getJSON( "api/level")
  .done(function( data ) {
    console.log("level:", data.level);
    levelInput = data.level;

    init();

  })
  .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });


//---------------------------------------------->END

