var connect = require("connect");
var serveStatic = require("serve-static");

	connect().use(serveStatic(__dirname + "/../dist/")).listen(1337);
	console.log("-= knobJS running - http://localhost:1337/examples/example.html =-");
