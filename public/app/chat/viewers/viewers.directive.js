(function () {
	const app = angular.module('filesync.chat.viewers');

	app.directive('fsViewers', function () {
		return {
			restrict: 'AE',
			templateUrl: '/app/chat/viewers/viewers.part.html',
			controller: "viewersController",
			controllerAs: "vC"
		}
	});
})();
