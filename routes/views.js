'use strict';

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
    handler: (request, reply) => reply.view('game', {
      name: 'Bossuyt Sander & Verheye Lieselot',
      title: 'Connect the dots'
    })
  }


];
