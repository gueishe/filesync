'use strict';

var viewers = function (serverSocket) {
	var data = [];

	return {
		add: function add(viewer) {
			data.push(viewer);
		},

		remove: function remove(viewer) {
			data = data.filter(function (dataViewer) {
				return dataViewer !== viewer;
			});
		},

		isEmpty: function isEmpty() {
			return data.length === 0;
		},

		containsNick: function containsNick(nick) {
			if(this.isEmpty()) {
				return true;
			} else if(nick === "") {
				return false;
			} else {
				return data.filter(function (viewer) {
						return viewer.nickname.toLowerCase() === nick.toLowerCase();
					})
					.length === 0;
			}
		},

		updateColorViewer: function updateColorViewer(viewer, color) {
			data[data.indexOf(viewer)].color = color;
		},

		getRandomViewer: function getRandomViewer() {
			return data[Math.floor((Math.random() * (data.length)))].nickname;
		},

		getCountViewer: function getCountViewer() {
			return data.length;
		},

		getViewers: function getViewers() {
			return data;
		},

		updateTime: function updateTime(viewer, state) {
			var tmp = new Date();
			if(state === "hidden") {
				var user = data[data.indexOf(viewer)];
				var innn = user.timeIn;
				var out = tmp.valueOf();
				data[data.indexOf(viewer)].time += (out - innn) / 1000;
			} else if(state === "visible") {
				data[data.indexOf(viewer)].timeIn = tmp.valueOf();
			}
			return data[data.indexOf(viewer)];
		}
	};
};

module.exports = viewers;
