'use strict';

var messages = function (serverSocket) {
	var data = [];
	var maxMessages = 1000;

	function _full() {
		return data.length === maxMessages;
	}

	return {
		add: function add(time, viewer, message) {
			if(_full()) {
				data.shift();
			}
			data.push({
				time: time,
				viewer: viewer,
				message: message
			});
		},

		getData: function getData() {
			return data;
		},

		getMaxMessages: function getMaxMessages() {
			return maxMessages;
		},

		setMaxMessages: function setMaxMessages(newMax) {
			maxMessages = newMax;
		}
	};
};

module.exports = messages;
