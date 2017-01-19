'use strict';

var Bot = function (serverSocket) {

	var methods = require('./bot')(serverSocket);
	var events = require('./botSocket')(serverSocket, methods);

	return {
		methods: methods,
		events: events,
		name: "bot"
	};
};

module.exports = Bot;
