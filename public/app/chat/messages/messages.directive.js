(function () {
	const app = angular.module('filesync.chat.messages');

	app.directive('fsMessages', function () {
		return {
			restrict: 'AE',
			templateUrl: '/app/chat/messages/messages.part.html',
			controller: "messagesController",
			controllerAs: "mC",
			link: function ($scope, element) {
				let raw = element[0].children[0];
				$scope.$watch('mC.messages', function (newValue, oldValue) {
					raw.scrollTop = raw.scrollHeight;
				})
			}
		}
	});
})();
