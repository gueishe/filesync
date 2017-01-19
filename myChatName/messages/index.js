'use strict';

var Messages = function (serverSocket) {

	var methods = require('./messages')(serverSocket);
	var events = require('./messagesSocket')(serverSocket, methods);

	return {
		methods: methods,
		events: events,
		name: "messages"
	};
};

module.exports = Messages;
