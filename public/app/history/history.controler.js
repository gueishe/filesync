(function () {

	const app = angular.module('filesync.history');

	app.controller('historyController', ['historyService', 'visibilityService',
        function (historyService, visibilityService) {
			this.edits = historyService.edits;
			this.visibility = visibilityService;

			this.remove = function (edit) {
				historyService.remove(edit);
			};
  }
]);
})();
