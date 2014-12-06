var fs = require('fs')
, server = require('./server');

// standard
function sendInterface(response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	var html = fs.readFileSync(__dirname + "/pages/index.html")
	response.end(html);
}
function sendMainCss(response) {
	response.writeHead(200, {"Content-Type": "text/css"});
	var cssMain = fs.readFileSync(__dirname + "/pages/style/css/main.css")
	response.end(cssMain);
}
function sendMapCss(response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	var cssMap = fs.readFileSync(__dirname + "/pages/style/css/main.css.map")
	response.end(cssMap);
}
function sendPluginJs(response) {
	response.writeHead(200, {"Content-Type": "application/javascript"});
	var jsPlugin = fs.readFileSync(__dirname + "/pages/js/plugins.js")
	response.end(jsPlugin);
}
function sendMainJs(response) {
	response.writeHead(200, {"Content-Type": "application/javascript"});
	var jsMain = fs.readFileSync(__dirname + "/pages/js/main.js")
	response.end(jsMain);
}

// updateable
function sendModernizr(response) {
	response.writeHead(200, {"Content-Type": "application/javascript"});
	var jsModernizr = fs.readFileSync(__dirname + "/pages/js/vendor/modernizr-2.6.2.min.js")
	response.end(jsModernizr);
}

// fonts
// function sendFontCamptonLightTtf(response) {
// 	console.log('===');
// 	console.log(response);
// 	console.log('===');
// 	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
// 	var font = fs.readFileSync(__dirname + "/pages/style/font/")
// 	response.end(font);
// }


exports.sendInterface = sendInterface;
exports.sendMainCss = sendMainCss;
exports.sendMapCss = sendMapCss;
exports.sendPluginJs = sendPluginJs;
exports.sendMainJs = sendMainJs;

exports.sendModernizr = sendModernizr;

// exports.sendFontCamptonLightTtf = sendFontCamptonLightTtf;

