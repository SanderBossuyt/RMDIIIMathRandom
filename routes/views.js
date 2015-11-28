'use strict';

//let script = require('../_js/script.js');


module.exports = [

  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => reply.view('index', {
      name: 'Bossuyt Sander & Verheye Lieselot',
      title: 'RMDOpdracht'
    })
  },
  {
    method: 'GET',
    path: '/connectthedots',
    handler: (request, reply) => {
      console.log(request.payload);
      return reply.view('game', {
        title: 'connect the dots',
        level: 'easy'
      });
    }
  },

   {
    method: 'POST',
    path: '/connectthedots',
    handler: (request, reply) => {
      console.log(request.payload.level);
      if(request.payload.level === 'easy'){
        //script(request.payload.level);
      }
      return reply.view('game', {
        title: 'connect the dots',
        level: request.payload.level
      });

    }
  }


];
