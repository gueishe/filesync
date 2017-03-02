(function () {

	angular.module('filesync')
		.factory('visibilityService', ['Visibility', 'socketService',
            function (Visibility, socketService) {
				Visibility.change(function (evt, state) {
					// state === 'hidden' || 'visible'
					socketService.userChangedState(state);
				});

				socketService.userChangedState('visible');

				var service = {
					states: {}
				};

				socketService.onVisibilityStatesChanged(function (states) {
					service.states = states;
				});
				return service;
            }
        ]);
})();
