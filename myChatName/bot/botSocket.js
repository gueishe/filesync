'use strict';

var botEvents = function (serverSocket, bot) {

	return {
		newClientSocket: function (clientSocket) {
			clientSocket.on('bot:command', function () {
				bot.command();
			});

			clientSocket.on('bot:roulette', function () {
				bot.roulette();
			});

			clientSocket.on('bot:info', function () {
				bot.info();
			});

			clientSocket.on('bot:updateInfo', function (newInfo) {
				bot.updateInfo(newInfo);
			});
		}
	};
};

module.exports = botEvents;
