'use strict';

//let script = require('../_js/script.js');


module.exports = [

  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      request.session.clear();
      //request.session.set('data', {});
      return reply.view('index', {
        name: 'Bossuyt Sander & Verheye Lieselot',
        title: 'connect the dots'
      });
    }
  },
  {
    method: 'GET',
    path: '/connectthedots',
    handler: (request, reply) => {
      //console.log("here", request.payload);
      return reply.view('game', {
        title: 'connect the dots',
        level: 'easy'
      });
    }
  },

   /*{
    method: 'POST',
    path: '/connectthedots',
    handler: (request, reply) => {
      request.session.set('level', request.payload.level);
      //checks als de level leeg is redirecten
      return reply.view('game', {
        title: 'connect the dots',
        level: request.payload.level
      });

    }*/
    {
    method: 'POST',
    path: '/connectthedots',
    handler: (request, reply) => {
      request.session.clear();
      //console.log(request.session);
      console.log(request.payload);
      request.session.set({level: request.payload.level, playmode: request.payload.mode});
      //console.log(request.session);
      //checks als de level leeg is redirecten
      return reply.view('game', {
        title: 'connect the dots',
        level: request.payload.level
      });

    }
  }


];
