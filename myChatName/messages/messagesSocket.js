'use strict';

var messagesEvents = function (serverSocket, messages) {

	function _notify(data) {
		serverSocket.emit('messages:updated', data);
	}

	return {
		newClientSocket: function (clientSocket) {
			clientSocket.on('message:new', function (time, message) {
				messages.add(time, clientSocket.viewer, message);
				_notify("");
			});
		}
	};

};

module.exports = messagesEvents;
