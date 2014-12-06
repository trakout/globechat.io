var fs = require('fs')
, server = require('./server');

// standard
function sendInterface(response) {
	console.log("Request handler 'interface' was called.");
	response.writeHead(200, {"Content-Type": "text/html"});
	var html = fs.readFileSync(__dirname + "/pages/index.html")
	response.end(html);
}
function sendMainCss(response) {
	console.log("Request handler 'main.css' was called.");
	response.writeHead(200, {"Content-Type": "text/css"});
	var cssMain = fs.readFileSync(__dirname + "/pages/style/css/main.css")
	response.end(cssMain);
}
function sendPluginJs(response) {
	console.log("Request handler 'plugins.js' was called.");
	response.writeHead(200, {"Content-Type": "application/javascript"});
	var jsPlugin = fs.readFileSync(__dirname + "/pages/js/plugins.js")
	response.end(jsPlugin);
}
function sendMainJs(response) {
	console.log("Request handler 'main.js' was called.");
	response.writeHead(200, {"Content-Type": "application/javascript"});
	var jsMain = fs.readFileSync(__dirname + "/pages/js/main.js")
	response.end(jsMain);
}

// updateable
function sendModernizr(response) {
	console.log("Request handler 'modernizr' was called.");
	response.writeHead(200, {"Content-Type": "application/javascript"});
	var jsModernizr = fs.readFileSync(__dirname + "/pages/js/vendor/modernizr-2.6.2.min.js")
	response.end(jsModernizr);
}



exports.sendInterface = sendInterface;
exports.sendMainCss = sendMainCss;
exports.sendPluginJs = sendPluginJs;
exports.sendMainJs = sendMainJs;

exports.sendModernizr = sendModernizr;