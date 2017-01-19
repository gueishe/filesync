socket.on('file:changed', function () {
	if(!socket.conn.request.isAdmin) {
		// if the user is not admin
		// skip this
		return socket.emit('error:auth', 'Unauthorized :)');
	}

	// forward the event to everyone
	serverSocket.emit.apply(serverSocket, ['file:changed'].concat(_.toArray(arguments)));
});

socket.visibility = 'visible';

socket.on('user-visibility:changed', function (state) {
socket.visibility = state;
socket.viewer = viewers.updateTime(socket.viewer, state);
serverSocket.emit('users:visibility-states', getVisibilityCounts());
});
});

function getVisibilityCounts() {
	return _.chain(serverSocket.sockets.sockets)
		.values()
		.countBy('visibility')
		.value();
}
