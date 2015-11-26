'use strict';
angular
	.module('FileSync')
	.controller('SocialCtrl', ['$scope', 'SocketIOService', function ($scope, SocketIOService) {
		this.viewers = [];
		this.messages = [];
		this.message = '';
		this.color = '';
		this.colors = ['RED', 'BLUE', 'BLACK', 'PURPLE', '#6BACF6', '#346398', '#983455', '#44AC34'];
		var bannedWord = ["", "*", " "];


		function onViewersUpdated(viewers) {
			this.viewers = viewers;
			$scope.$apply();
		}

		function onMessagesUpdated(messages) {
			this.messages = messages;
			$scope.$apply();
		}

		function addBannedWord(word) {
			this.bannedWord.push(word);
		}

		function isMsgOk(msg) {
			return bannedWord.filter((word) => word === msg)
				.length === 0;
		}

		function isMsgToBot(msg) {
			return msg.search('!bot') == 0;
		}

		function newMsgToBot(msg) {
			var command = msg.split(' ');
			console.log(command);
			switch(command[1]) {
			case 'roulette':
				SocketIOService.botRoulette();
				break;
			case 'infoCours':
				SocketIOService.botInfoCours();
				break;
			case 'updateInfo':
				command.shift();
				command.shift();
				SocketIOService.botUpdateInfo(command.join(' '));
				break;
			case 'command':
				SocketIOService.botCommand();
				break;
			}
		}

		this.sendMessage = function () {
			var msg = this.message;
			if(isMsgToBot(msg)) {
				newMsgToBot(msg);
			} else if(isMsgOk(msg)) {
				SocketIOService.sendMessage(msg);
				this.message = '';
			} else {
				console.log('Mot interdit !' + bannedWord);
			}
		}

		function showColor(color) {
			console.log(color);
		}

		this.updateColor = function () {
			SocketIOService.updateColor(this.color);
		}

		SocketIOService.onViewersUpdated(onViewersUpdated.bind(this));
		SocketIOService.onMessagesUpdated(onMessagesUpdated.bind(this));
  }]);
