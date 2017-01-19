'use strict';

var viewersEvents = function (serverSocket, viewers) {

	var colors = ['RED', 'GREEN', 'BLUE'];

	function _notify(data) {
		serverSocket.emit('viewers:updated', data);
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
				_notify();
			});
		}
	};
};

module.exports = viewersEvents;
