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

var colors = ['RED', 'BLUE', 'GREEN'];
sio.set('authorization', function (handshakeData, accept) {
	// @todo use something else than a private `query`
	handshakeData.isAdmin = handshakeData._query.access_token === config.auth.token;
	accept(null, true);
});

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
						return viewer.nickname.toLowerCase() === nick.toLowerCase();
					})
					.length === 0;
			}
		},

		updateColorViewer: function updateColorViewer(viewer, color) {
			data[data.indexOf(viewer)].color = color;
		},

		getRandomViewer: function getRandomViewer() {
			return data[Math.floor((Math.random() * (data.length)))].nickname;
		},

		getCountViewer: function getCountViewer() {
			return data.length;
		},

		getViewers: function getViewers() {
			return data;
		}
	};
}

var viewers = Viewers(sio);

function Messages(sio) {
	var data = [];
	var maxMessages = 5;

	function notifyChanges() {
		sio.emit('messages:updated', data);
	}

	function full() {
		return data.length == maxMessages;
	}

	return {
		add: function add(time, viewer, message) {
			if(full()) {
				data.shift();
			}
			data.push({
				time: time,
				viewer: viewer,
				message: message
			});
			notifyChanges();
		},

		getData: function getData() {
			return data;
		},

		getMaxMessages: function getMaxMessages() {
			return maxMessages;
		},

		setMaxMessages: function setMaxMessages(newMax) {
			maxMessages = newMax;
		}
	};
}

var messages = Messages(sio);

function Bot(sio) {
	var infoCours = "Pas encore d\'information sur le cours actuel.";
	var botViewer = {
		nickname: 'JbotS',
		color: '#FF0077'
	};
	var botSys = {
		nickname: 'INFO',
		color: '#AA00FF'
	};
	var commands = "!bot roulette@Utile pour designer quelqu\'un !|!bot infoCours@Permet d\'avoir des informations sur le cours";

	return {
		updateInfo: function updateInfo(newInfo) {
			infoCours = newInfo;
		},

		roulette: function roulette() {
			var date = new Date();
			date = date.getHours() + ":" + date.getMinutes();
			messages.add(date, botSys, 'La roulette est lancée !');
			messages.add(date, botViewer, 'Le viewer choisie est ' + viewers.getRandomViewer());
		},

		info: function info() {
			var date = new Date();
			date = date.getHours() + ":" + date.getMinutes();
			messages.add(date, botSys, infoCours);
		},

		command: function command() {
			var date = new Date();
			date = date.getHours() + ":" + date.getMinutes();
			var command = commands.split('|');
			messages.add(date, botSys, 'Liste des commandes disponible : ');
			command.forEach(function (info) {
				var tabInfo = info.split('@');
				messages.add(date, {
					nickname: tabInfo[0],
					color: '#FF0077'
				}, tabInfo[1]);
			});
		}
	}
}

var bot = Bot(sio);

// @todo extract in its own
sio.on('connection', function (socket) {

	socket.on('viewer:new', function (nickname) {
		if(nickname === "") {
			console.log("viewer:name-empty");
			socket.emit('viewer-err:name', nickname);
		} else if(viewers.containsNick(nickname)) {
			console.log("viewer:name-ok");
			socket.viewer = {
				nickname: nickname,
				color: colors[nickname.length % 3]
			};
			viewers.add(socket.viewer);
			var date = new Date();
			date = date.getHours() + ":" + date.getMinutes();
			messages.add(date, {
				nickname: "connexion",
				color: "GREY"
			}, "" + nickname);
			logger.info('new viewer with nickname %s', nickname);
		} else {
			console.log("viewer:name-already-taken");
			socket.emit('viewer-err:name', nickname);
		}

	});

	socket.on('message:new', function (time, message) {
		messages.add(time, socket.viewer, message);
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
		var date = new Date();
		date = date.getHours() + ":" + date.getMinutes();
		if(socket.viewer) {
			messages.add(date, {
				nickname: "déconnexion",
				color: "GREY"
			}, "" + socket.viewer.nickname);
			logger.info('viewer disconnected %s', socket.viewer.nickname);
		}
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


var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
rl.on('line', function (line) {
	var res = line.split(' ');
	switch(res[0]) {
	case 'command':
		console.log('---COMMANDES---')
		console.log('    servinfo');
		console.log('    viewerCount');
		console.log('    viewers');
		console.log('    messages');
		break;
	case 'servinfo':
		console.log(sio);
		break;
	case 'viewerCount':
		console.log(viewers.getCountViewer());
		break;
	case 'viewers':
		console.log(viewers.getViewers());
		break;
	case 'messages':
		console.log(messages.getData());
		break;
	case 'setMaxMessages':
		if(res[1]) {
			messages.setMaxMessages(res[1]);
		}
		console.log('Maximum de messages dans le chat :' + res[1]);
		break;
	case 'getMaxMessages':
		console.log('Maximum de messages dans le chat : ' + messages.getMaxMessages());
		break;
	default:
		console.log('---COMMANDES---')
		console.log('    servinfo');
		console.log('    viewerCount');
		console.log('    viewers');
		console.log('    messages');
		console.log('    setMaxMessages [number]');
		console.log('    getMaxMessages');
		break;
	}
	rl.prompt();
});
