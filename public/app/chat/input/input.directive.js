(function () {
	const app = angular.module('filesync.chat.input');

	app.directive('fsInput', function () {
		return {
			restrict: 'AE',
			templateUrl: '/app/chat/input/input.part.html',
			// link: function() {
			//
			// }
		}
	});
})();
