'use strict';

module.exports = [

  {
    method: 'GET',
    path: '/api/level',
    handler: (request, reply) => reply({
      level: request.session.get('level'),
      playmode: request.session.get('playmode')
    })
  }

];
