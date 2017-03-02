(function () {
	const app = angular.module('filesync.chat');

	app.directive('chat', function () {
		return {
			restrict: 'AE',
			templateUrl: 'public/app/chat/chat.part.html'
		}
	});
})();
