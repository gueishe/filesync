(function () {
	const app = angular.module('filesync', [
		'ui.router',
		'ngAnimate',
		'hljs',
		'filesync.chat',
		'filesync.history'
	]);

	app.constant('io', io)
		.constant('Visibility', Visibility)
		.constant('_', _);

	app.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {

		$locationProvider.html5Mode(true);
		$stateProvider.state('index', {
			url: '/',
			templateUrl: 'public/index.html'
		});

		$urlRouterProvider.otherwise('/');
	});

})();
