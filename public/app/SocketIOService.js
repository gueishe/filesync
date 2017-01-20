'use strict';
angular.module('FileSync')
	.factory('SocketIOService', ['io', '_', '$timeout', function (io, _, $timeout) {
		var socket = io();
		var _onFileChanged = _.noop;
		var _onVisibilityStatesChanged = _.noop;

		socket.on('connect', function () {
			console.log('connected');
			var login = prompt('Nickname?');
			if(login == null) {
				login = "";
			}
			socket.emit('viewer:new', login);
		});

		socket.on('file:changed', function (filename, timestamp, content) {
			$timeout(function () {
				_onFileChanged(filename, timestamp, content);
			});
		});

		socket.on('viewer-err:name', function (nickname) {
			console.log("Erreur sur le nom " + nickname + ".");
			var login = prompt("Erreur sur le nom " + nickname + ".\nNew nickname?");
			if(login == null) {
				login = "";
			}
			socket.emit('viewer:new', login);
		});

		socket.on('users:visibility-states', function (states) {
			$timeout(function () {
				_onVisibilityStatesChanged(states);
			});
		});

		socket.on('error:auth', function (err) {
			// @todo yeurk
			alert(err);
		});

		return {
			onViewersUpdated: function (f) {
				socket.on('viewers:updated', f);
			},

			sendMessage: function (time, message) {
				socket.emit('message:new', time, message);
			},

			updateColor: function (color) {
				socket.emit('color:update', color)
			},

			onMessagesUpdated: function (f) {
				socket.on('messages:updated', f);
				console.log("COUCOU");
			},

			botRoulette: function () {
				socket.emit('bot:roulette');
			},

			botInfoCours: function () {
				socket.emit('bot:info');
			},

			botUpdateInfo: function (newInfo) {
				socket.emit('bot:updateInfo', newInfo);
			},

			botCommand: function () {
				socket.emit('bot:command');
			},

			onFileChanged: function (f) {
				_onFileChanged = f;
			},

			onVisibilityStatesChanged: function (f) {
				_onVisibilityStatesChanged = f;
			},

			userChangedState: function (state) {
				socket.emit('user-visibility:changed', state);
			}
		};
  }]);
