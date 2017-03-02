(function () {

	const app = angular.module('filesync.history');

	app.factory('historyService', function (socketService, _) {
		var edits = [];

		socketService.onFileChanged(function (filename, timestamp, content) {
			edits.unshift({
				filename: filename,
				timestamp: timestamp,
				content: content
			});
		});

		return {
			edits: edits,
			remove: function (edit) {
				_.remove(edits, edit);
			}
		};
	});
})();
