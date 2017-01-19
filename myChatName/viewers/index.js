'use strict';

var Viewers = function (serverSocket) {
	var methods = require('./viewers')(serverSocket);
	var events = require('./viewersSocket')(serverSocket, methods);

	return {
		methods: methods,
		events: events,
		name: "viewers"
	};
};

module.exports = Viewers;
