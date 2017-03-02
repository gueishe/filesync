(function () {

	const app = angular.module('filesync.chat')
		.controller('inputController', ['$scope', 'socketService', function ($scope, socketService) {
            // Maybe use angular-scroll for new messages scroll down and goto messages, pinned etc
			let vm = this;
			var bannedWord = ["", "*", " "];

			function addBannedWord(word) {
				vm.bannedWord.push(word);
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
					socketService.botRoulette();
					break;
				case 'infoCours':
					socketService.botInfoCours();
					break;
				case 'updateInfo':
					command.shift();
					command.shift();
					socketService.botUpdateInfo(command.join(' '));
					break;
				case 'command':
					socketService.botCommand();
					break;
				}
			}

			vm.sendMessage = function () {
				var msg = vm.message;
				if(isMsgToBot(msg)) {
					newMsgToBot(msg);
				} else if(isMsgOk(msg)) {
					socketService.sendMessage(moment()
						.format('h:mm'), msg);
					vm.message = '';
				} else {
					console.log('Mot interdit !' + bannedWord);
				}
			}
		}])
})();
