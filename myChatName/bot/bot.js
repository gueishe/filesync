'use strict';

var bot = function (serverSocket) {

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
			serverSocket.modules['messages'].methods.add(date, botSys, 'La roulette est lancée !');
			var randomViewer = serverSocket.modules['viewers'].methods.getRandomViewer();
			var msg = 'Le viewer choisie est ' + randomViewer;
			serverSocket.modules['messages'].methods.add(date, botViewer, msg);
		},

		info: function info() {
			var date = new Date();
			date = date.getHours() + ":" + date.getMinutes();
			serverSocket.modules['messages'].methods.add(date, botSys, infoCours);
		},

		command: function command() {
			var date = new Date();
			date = date.getHours() + ":" + date.getMinutes();
			var command = commands.split('|');
			serverSocket.modules['messages'].methods.add(date, botSys, 'Liste des commandes disponible : ');
			command.forEach(function (info) {
				var tabInfo = info.split('@');
				serverSocket.modules['messages'].methods.add(date, {
					nickname: tabInfo[0],
					color: '#FF0077'
				}, tabInfo[1]);
			});
		}
	};
};

module.exports = bot;
