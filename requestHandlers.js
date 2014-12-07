var fs = require('fs')
, server = require('./server');

// standard
function sendInterface(response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	var html = fs.readFileSync(__dirname + "/pages/index.html")
	response.end(html);
}
function sendChat(response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	var html = fs.readFileSync(__dirname + "/pages/chat.html")
	response.end(html);
}
function sendComingSoon(response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	var html = fs.readFileSync(__dirname + "/pages/comingsoon.html")
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
function sendHollaJs(response) {
	response.writeHead(200, {"Content-Type": "application/javascript"});
	var jsHolla = fs.readFileSync(__dirname + "/pages/js/holla.js")
	response.end(jsHolla);
}

// updateable
function sendModernizr(response) {
	response.writeHead(200, {"Content-Type": "application/javascript"});
	var jsModernizr = fs.readFileSync(__dirname + "/pages/js/vendor/modernizr-2.6.2.min.js")
	response.end(jsModernizr);
}

// fonts
function sendFontCamptonBoldEot(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/campton-bold-webfont.eot")
	response.end(font);
}
function sendFontCamptonBoldSvg(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/campton-bold-webfont.svg")
	response.end(font);
}
function sendFontCamptonBoldTtf(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/campton-bold-webfont.ttf")
	response.end(font);
}
function sendFontCamptonBoldWoff(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/campton-bold-webfont.woff")
	response.end(font);
}
function sendFontCamptonBoldWoffDos(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/campton-bold-webfont.woff2")
	response.end(font);
}
function sendFontCamptonLightEot(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/campton-light-webfont.eot")
	response.end(font);
}
function sendFontCamptonLightSvg(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/campton-light-webfont.svg")
	response.end(font);
}
function sendFontCamptonLightTtf(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/campton-light-webfont.ttf")
	response.end(font);
}
function sendFontCamptonLightWoff(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/campton-light-webfont.woff")
	response.end(font);
}
function sendFontCamptonLightWoffDos(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/campton-light-webfont.woff2")
	response.end(font);
}
function sendFontAwesomeEot(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/fontawesome-webfont.eot")
	response.end(font);
}
function sendFontAwesomeSvg(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/fontawesome-webfont.svg")
	response.end(font);
}
function sendFontAwesomeTtf(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/fontawesome-webfont.ttf")
	response.end(font);
}
function sendFontAwesomeWoff(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var font = fs.readFileSync(__dirname + "/pages/style/font/fontawesome-webfont.woff")
	response.end(font);
}

function sendIco(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var ico = fs.readFileSync(__dirname + "/pages/img/favicon.ico")
	response.end(ico);
}
function sendMobile(response) {
	response.writeHead(200, {"Content-Type": "application/x-font-opentype"});
	var mobile = fs.readFileSync(__dirname + "/pages/img/apple-touch-icon-precomposed.png")
	response.end(mobile);
}

exports.sendIco = sendIco;
exports.sendMobile = sendMobile;

exports.sendFontCamptonBoldEot = sendFontCamptonBoldEot;
exports.sendFontCamptonBoldSvg = sendFontCamptonBoldSvg;
exports.sendFontCamptonBoldTtf = sendFontCamptonBoldTtf;
exports.sendFontCamptonBoldWoff = sendFontCamptonBoldWoff;
exports.sendFontCamptonBoldWoffDos = sendFontCamptonBoldWoffDos;
exports.sendFontCamptonLightEot = sendFontCamptonLightEot;
exports.sendFontCamptonLightSvg = sendFontCamptonLightSvg;
exports.sendFontCamptonLightTtf = sendFontCamptonLightTtf;
exports.sendFontCamptonLightWoff = sendFontCamptonLightWoff;
exports.sendFontCamptonLightWoffDos = sendFontCamptonLightWoffDos;
exports.sendFontAwesomeEot = sendFontAwesomeEot;
exports.sendFontAwesomeSvg = sendFontAwesomeSvg;
exports.sendFontAwesomeTtf = sendFontAwesomeTtf;
exports.sendFontAwesomeWoff = sendFontAwesomeWoff;

exports.sendInterface = sendInterface;
exports.sendChat = sendChat;
exports.sendComingSoon = sendComingSoon;
exports.sendMainCss = sendMainCss;
exports.sendMapCss = sendMapCss;
exports.sendPluginJs = sendPluginJs;
exports.sendMainJs = sendMainJs;
exports.sendHollaJs = sendHollaJs;

exports.sendModernizr = sendModernizr;

// exports.sendFontCamptonLightTtf = sendFontCamptonLightTtf;

