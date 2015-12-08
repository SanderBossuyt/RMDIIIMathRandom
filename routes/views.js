'use strict';

//let script = require('../_js/script.js');


module.exports = [

  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      request.session.reset();
      request.session.clear();

      return reply.view('index', {
        name: 'Bossuyt Sander & Verheye Lieselot',
        title: 'connect the dots',
      });

    }
  },
  {
    method: 'GET',
    path: '/connectthedots',
    handler: (request, reply) => {
      if(request.session._store.level && request.session._store.playmode){
        console.log("not empty session");

        return reply.view('game', {
          title: 'connect the dots',
          level: request.session.level
        });

      }else{
        console.log("empty session");
        return reply.view('index', {
          name: 'Bossuyt Sander & Verheye Lieselot',
          title: 'connect the dots',
          error: 'something went wrong, please try again.'

        });
      }

      //console.log("here", request.payload);

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
      request.session.set({level: request.payload.level, playmode: request.payload.mode});

      if(request.session._store.level && request.session._store.playmode){
        return reply.view('game', {
          title: 'connect the dots',
          level: request.payload.level
        });
      }else{
        return reply.view('index', {
          name: 'Bossuyt Sander & Verheye Lieselot',
          title: 'connect the dots',
          error: 'something went wrong, please try again.'
        });
      }


    }
  }


];
