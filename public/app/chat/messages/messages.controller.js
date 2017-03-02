(function () {

	const app = angular.module('filesync.chat')
		.controller('messagesController', ['$scope', 'socketService', function ($scope, socketService) {
            // Maybe use angular-scroll for new messages scroll down and goto messages, pinned etc
			let vm = this;
			vm.messages = [];
			vm.message = '';
			function onMessagesUpdated(messages) {
				vm.messages = messages;
				$scope.$apply();
			}
			socketService.onMessagesUpdated(onMessagesUpdated.bind(vm));

		}])
})();
