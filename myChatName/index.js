'use strict';

var myChatName = function () {

	var io = require('socket.io');
	var path = require('path');
	var express = require('express');
	var logger = require('winston');
	var config = require('../config')(logger);
	var _ = require('lodash');
	var app = express();
	var server = app.listen(config.server.port, function () {
		logger.info('Server listening on %s', config.server.port);
	});
	var serverSocket = io(server);
	var messages = require('./messages')(serverSocket);
	var bot = require('./bot')(serverSocket);
	var viewers = require('./viewers')(serverSocket);
	var myChatNameSocket = require('./myChatNameSocket')(serverSocket);
	myChatNameSocket.init(messages, bot, viewers);


	app.use(express.static(path.resolve(__dirname, '../public')));

	app.get('/', function (req, res) {
		res.sendFile(__dirname + '../public/index.html');
	});



	return {
		helloWorld: function () {
			console.log("Coucou");
		},
		serverSocket: serverSocket,
		serverEvents: myChatNameSocket,
		messages: messages,
		bot: bot,
		viewers: viewers
	};
};

module.exports = myChatName;
