'use strict';

var _ = require("lodash");

var viewersEvents = function (serverSocket, viewers) {

	var colors = ['RED', 'GREEN', 'BLUE'];

	function _notifyViewers() {
		var data = serverSocket.modules['viewers'].methods.getViewers();
		serverSocket.emit('viewers:updated', data);
	}

	function _notifyMessages() {
		var data = serverSocket.modules['messages'].methods.getMessages();
		serverSocket.emit('messages:updated', data);
	}

	function _notify() {
		_notifyViewers();
		_notifyMessages();
	}

	function getVisibilityCounts() {
		console.log("getVisibilityCounts call");
		return _.chain(serverSocket.sockets.sockets)
			.values()
			.countBy('visibility')
			.value();
	}

	return {
		newClientSocket: function (clientSocket) {

			clientSocket.on('viewer:new', function (nickname) {
				if(nickname === "") {
					console.log("viewer:name-empty");
					clientSocket.emit('viewer-err:name', nickname);
				} else if(viewers.containsNick(nickname)) {
					console.log("viewer:name-ok");
					var tmp = new Date();
					clientSocket.viewer = {
						nickname: nickname,
						color: colors[nickname.length % 3],
						time: 0,
						timeIn: tmp.valueOf()
					};
					viewers.add(clientSocket.viewer);
					var date = new Date();
					date = date.getHours() + ":" + date.getMinutes();
					serverSocket.modules['messages'].methods.add(date, {
						nickname: "connexion",
						color: "GREY"
					}, "" + nickname);
					_notify();
				} else {
					console.log("viewer:name-already-taken");
					clientSocket.emit('viewer-err:name', nickname);
				}
			});
			clientSocket.on('color:update', function (color) {
				viewers.updateColorViewer(clientSocket.viewer, color);
				clientSocket.viewer.color = color;
				_notifyViewers();
			});

			clientSocket.on('file:changed', function () {
				console.log("file:changed call");
				if(!clientSocket.conn.request.isAdmin) {
					return clientSocket.emit('error:auth', 'Unauthorized :)');
				}
				serverSocket.emit.apply(serverSocket, ['file:changed'].concat(_.toArray(arguments)));
			});
			clientSocket.visibility = 'visible';
			clientSocket.on('user-visibility:changed', function (state) {
				clientSocket.visibility = state;
				clientSocket.viewer = viewers.updateTime(clientSocket.viewer, state);
				serverSocket.emit('users:visibility-states', getVisibilityCounts());
			});
		}
	};
};

module.exports = viewersEvents;
