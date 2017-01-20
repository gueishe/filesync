'use strict';

var botEvents = function (serverSocket, bot) {

	function _notifyMessages() {
		var data = serverSocket.modules['messages'].methods.getMessages();
		serverSocket.emit('messages:updated', data);
	}

	return {
		newClientSocket: function (clientSocket) {
			clientSocket.on('bot:command', function () {
				bot.command();
				_notifyMessages();
			});

			clientSocket.on('bot:roulette', function () {
				bot.roulette();
				_notifyMessages();
			});

			clientSocket.on('bot:info', function () {
				bot.info();
				_notifyMessages();
			});

			clientSocket.on('bot:updateInfo', function (newInfo) {
				bot.updateInfo(newInfo);
				_notifyMessages();
			});
		}
	};
};

module.exports = botEvents;
