'use strict';

var messagesEvents = function (serverSocket, messages) {

	function _notify() {
		serverSocket.emit('messages:updated', messages.getMessages());
	}

	return {
		newClientSocket: function (clientSocket) {
			clientSocket.on('message:new', function (time, message) {
				messages.add(time, clientSocket.viewer, message);
				_notify();
			});
		},
		notify: function () {
			serverSocket.emit('messages:updated', messages.getMessages());
		}
	};

};

module.exports = messagesEvents;
