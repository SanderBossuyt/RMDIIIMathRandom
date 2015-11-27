'use strict';

module.exports = [

  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => reply.view('index', {
      name: 'Bossuyt Sander & Verheye Lieselot',
      title: 'RMDOpdracht'
    })
  }

];
