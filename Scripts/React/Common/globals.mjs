if (typeof server == "undefined") {
	
	let serverside = (typeof global != "undefined");
	let server = serverside ? global : window;

	server.server = server;
	server.serverside = serverside;
	server.clientside = !serverside;

	if (clientside) server.cookies = document.cookies;

}// if;