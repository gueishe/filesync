(function () {

	const app = angular.module('filesync.chat')
		.controller('viewersController', ['$scope', 'socketService', function ($scope, socketService) {
            // Maybe use angular-scroll for new messages scroll down and goto messages, pinned etc
			let vm = this;
			vm.viewers = [];

			$scope.nick = "Malo";

			function onViewersUpdated(viewers) {
				vm.viewers = viewers;
				$scope.$apply();
			}
			socketService.onViewersUpdated(onViewersUpdated.bind(vm));

			function showColor(color) {
				console.log(color);
			}

			vm.updateColor = function () {
				socketService.updateColor(vm.color);
			}
		}])
})();
