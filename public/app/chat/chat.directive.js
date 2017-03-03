(function () {
	const app = angular.module('filesync.chat');

	app.directive('fsChat', function () {
		return {
			restrict: 'AE',
			templateUrl: '/app/chat/chat.part.html'
		}
	});
})();
