'use strict';

var io = require('socket.io');
var express = require('express');
var path = require('path');
var app = express();
var _ = require('lodash');

var logger = require('winston');
var config = require('./config')(logger);

app.use(express.static(path.resolve(__dirname, './public')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(config.server.port, function () {
	logger.info('Server listening on %s', config.server.port);
});


var sio = io(server);

sio.set('authorization', function (handshakeData, accept) {
	// @todo use something else than a private `query`
	handshakeData.isAdmin = handshakeData._query.access_token === config.auth.token;
	accept(null, true);
});

var colors = ["RED", "BLUE", "GREEN"];

function Viewers(sio) {
	var data = [];

	function notifyChanges() {
		sio.emit('viewers:updated', data);
	}

	return {
		add: function add(viewer) {
			data.push(viewer);
			notifyChanges();
		},

		remove: function remove(viewer) {
			data = data.filter(function (dataViewer) {
				return dataViewer !== viewer
			});
			notifyChanges();
			console.log('-->', data);
		},

		isEmpty: function isEmpty() {
			return data.length === 0;
		},

		containsNick: function containsNick(nick) {
			if(this.isEmpty()) {
				return true;
			} else if(nick === "") {
				return false;
			} else {
				return data.filter(function (viewer) {
						return viewer.nickname === nick;
					})
					.length === 0;
			}
		},

		updateColorViewer: function updateColorViewer(viewer, color) {
			data[data.indexOf(viewer)].color = color;
		},

		getRandomViewer: function getRandomViewer() {
			return data[Math.floor((Math.random() * (data.length)))].nickname;
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
		add: function add(viewer, message) {
			data.push({
				viewer: viewer,
				message: message
			});
			notifyChanges();
		},

		getData: function getData() {
			return data;
		}
	};
}

var messages = Messages(sio);

function Bot(sio) {
	var infoCours = "Pas encore d\'information sur le cours actuel.";
	var botViewer = {
		nickname: 'JbotS',
		color: 'PINK'
	};
	var botSys = {
		nickname: 'INFO',
		color: 'lightgrey'
	};
	var commands = "!bot roulette@Utile pour designer quelqu\'un !|!bot infoCours@Permet d\'avoir des informations sur le cours";

	return {
		updateInfo: function updateInfo(newInfo) {
			infoCours = newInfo;
			messages.add(botSys, infoCours);
		},

		roulette: function roulette() {
			messages.add(botSys, 'La roulette est lancée !');
			messages.add(botViewer, 'Le viewer choisie est ' + viewers.getRandomViewer());
		},

		info: function info() {
			messages.add(botSys, infoCours);
		},

		command: function command() {
			var command = commands.split('|');
			messages.add(botSys, 'Liste des commandes disponible : ');
			command.forEach(function (info) {
				var tabInfo = info.split('@');
				messages.add({
					nickname: tabInfo[0],
					color: 'PINK'
				}, tabInfo[1]);
			});
		}
	}
}

var bot = Bot(sio);

// @todo extract in its own
sio.on('connection', function (socket) {

	// console.log('nouvelle connexion', socket.id);
	socket.on('viewer:new', function (nickname) {
		if(nickname === "") {
			console.log("viewer:name-empty");
			sio.emit('viewer-err:name', nickname);
		} else if(viewers.containsNick(nickname)) {
			socket.viewer = {
				nickname: nickname,
				color: colors[nickname.length % 3]
			};
			viewers.add(socket.viewer);
			logger.info('new viewer with nickname %s', nickname);
		} else {
			sio.emit('viewers-err:name', nickname);
		}

	});

	socket.on('message:new', function (message) {
		messages.add(socket.viewer, message);
		logger.info('new message from %s', socket.viewer.nickname);
	});

	socket.on('color:update', function (color) {
		viewers.updateColorViewer(socket.viewer, color);
		socket.viewer.color = color;
	});

	socket.on('bot:command', function () {
		bot.command();
	});

	socket.on('bot:roulette', function () {
		bot.roulette();
	});

	socket.on('bot:info', function () {
		bot.info();
	});

	socket.on('bot:updateInfo', function (newInfo) {
		bot.updateInfo(newInfo);
	});

	socket.on('disconnect', function () {
		viewers.remove(socket.viewer);
		logger.info('viewer disconnected %s\nremaining:', socket.viewer.nickname);
	});

	socket.on('file:changed', function () {
		if(!socket.conn.request.isAdmin) {
			// if the user is not admin
			// skip this
			return socket.emit('error:auth', 'Unauthorized :)');
		}

		// forward the event to everyone
		sio.emit.apply(sio, ['file:changed'].concat(_.toArray(arguments)));
	});

	socket.visibility = 'visible';

	socket.on('user-visibility:changed', function (state) {
		socket.visibility = state;
		sio.emit('users:visibility-states', getVisibilityCounts());
	});
});

function getVisibilityCounts() {
	return _.chain(sio.sockets.sockets)
		.values()
		.countBy('visibility')
		.value();
}
