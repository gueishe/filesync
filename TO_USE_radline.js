var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
rl.on('line', function (line) {
	var res = line.split(' ');
	switch(res[0]) {
	case 'command':
		console.log('---COMMANDES---')
		console.log('    servinfo');
		console.log('    viewerCount');
		console.log('    viewers');
		console.log('    messages');
		break;
	case 'servinfo':
		console.log(serverSocket);
		break;
	case 'viewerCount':
		console.log(viewers.getCountViewer());
		break;
	case 'viewers':
		console.log(viewers.getViewers());
		break;
	case 'messages':
		console.log(messages.getData());
		break;
	case 'setMaxMessages':
		if(res[1]) {
			messages.setMaxMessages(res[1]);
		}
		console.log('Maximum de messages dans le chat :' + res[1]);
		break;
	case 'getMaxMessages':
		console.log('Maximum de messages dans le chat : ' + messages.getMaxMessages());
		break;
	default:
		console.log('---COMMANDES---')
		console.log('    servinfo');
		console.log('    viewerCount');
		console.log('    viewers');
		console.log('    messages');
		console.log('    setMaxMessages [number]');
		console.log('    getMaxMessages');
		break;
	}
	rl.prompt();
});
