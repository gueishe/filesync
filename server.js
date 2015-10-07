'use strict';

var io = require('socket.io');
var express = require('express');
var path = require('path');
var app = express();
var _ = require('lodash');

var logger = require('winston');
var config = require('./config')(logger);

app.use(express.static(path.resolve(__dirname, './public')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(config.server.port, function() {
  logger.info('Server listening on %s', config.server.port);
});


var sio = io(server);

sio.set('authorization', function(handshakeData, accept) {
  // @todo use something else than a private `query`
  handshakeData.isAdmin = handshakeData._query.access_token === config.auth.token;
  accept(null, true);
});

var color=["RED","BLUE","GREEN"];

function Viewers(sio) {
  var data = [];
  var nick = [];

  function notifyChanges() {
    sio.emit('viewers:updated', data);
  }

  return {
    add: function add(nickname, color) {
      data.push([color,nickname]);
      nick.push(nickname);
      notifyChanges();
      return data.length-1;
    },
    remove: function remove(nickname) {
      console.log("Removing " + nickname);
      var id = nick.indexOf(nickname);
      if (id > -1) {
        data.splice(id, 1);
        nick.splice(id, 1);
      }
      notifyChanges();
      console.log('-->', data);
    }
  };
}

var viewers = Viewers(sio);


function Messages(sio) {
  var data = [];

  function notifyChanges() {
    sio.emit('messages:updated', data);
  }

  return {
    add: function add(nickname, message, color) {
      data.push([nickname,message,color]);
      notifyChanges();
    }
  };
}


var messages = Messages(sio);

// @todo extract in its own
sio.on('connection', function(socket) {

  // console.log('nouvelle connexion', socket.id);
  socket.on('viewer:new', function(nickname) {
    socket.nickname = nickname;
    socket.color = color[nickname.length%3]
    viewers.add(nickname, socket.color );
    console.log('new viewer with nickname %s', nickname);
  });

  socket.on('message:new', function(message) {
    messages.add(socket.nickname ,message, socket.color);
    console.log('new message from %s', socket.nickname);
  });

  socket.on('disconnect', function() {
    viewers.remove(socket.nickname);
    console.log('viewer disconnected %s\nremaining:', socket.nickname);
  });

  socket.on('file:changed', function() {
    if (!socket.conn.request.isAdmin) {
      // if the user is not admin
      // skip this
      return socket.emit('error:auth', 'Unauthorized :)');
    }

    // forward the event to everyone
    sio.emit.apply(sio, ['file:changed'].concat(_.toArray(arguments)));
  });

  socket.visibility = 'visible';

  socket.on('user-visibility:changed', function(state) {
    socket.visibility = state;
    sio.emit('users:visibility-states', getVisibilityCounts());
  });
});

function getVisibilityCounts() {
  return _.chain(sio.sockets.sockets).values().countBy('visibility').value();
}
