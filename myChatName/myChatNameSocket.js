'use strict';

var logger = require('winston');
var config = require('../config')(logger);
var _ = require('lodash');

var myChatNameSocket = function (serverSocket) {

	serverSocket.set('authorization', function (handshakeData, accept) {
		handshakeData.isAdmin = handshakeData._query.access_token === config.auth.token;
		accept(null, true);
	});

	var socketsModule = {};

	serverSocket.on('file:changed', function () {
		console.log("CHANGED");
		if(!serverSocket.conn.request.isAdmin) {
			// if the user is not admin
			// skip this
			return serverSocket.emit('error:auth', 'Unauthorized :)');
		}

		// forward the event to everyone
		serverSocket.emit.apply(serverSocket, ['file:changed'].concat(_.toArray(arguments)));
	});

	serverSocket.visibility = 'visible';

	serverSocket.on('user-visibility:changed', function (state) {
		serverSocket.visibility = state;
		serverSocket.emit('users:visibility-states', getVisibilityCounts());
	});

	function getVisibilityCounts() {
		return _.chain(serverSocket.sockets.sockets)
			.values()
			.countBy('visibility')
			.value();
	}


	serverSocket.on('connection', function (clientSocket) {

		for(var key in socketsModule) {
			if(socketsModule.hasOwnProperty(key)) {
				var socketModule = socketsModule[key];
				socketModule.events.newClientSocket(clientSocket);
				serverSocket.modules = socketsModule;
			}
		}

		clientSocket.on('disconnect', function () {
			serverSocket.modules['viewers'].methods.remove(clientSocket.viewer);
			var date = new Date();
			date = date.getHours() + ":" + date.getMinutes();
			if(clientSocket.viewer) {
				serverSocket.modules['messages'].methods.add(date, {
					nickname: "déconnexion",
					color: "GREY"
				}, "" + clientSocket.viewer.nickname);
			}
		});
	});

	return {
		init: function () {
			for(var i = 0; i < arguments.length; i++) {
				socketsModule[arguments[i].name] = arguments[i];
			}
		}
	};
};

module.exports = myChatNameSocket;
