var debug = false;

var server = require("./server")
, router = require("./route")
, requestHandlers = require("./requestHandlers");
 
var handle = {};
handle["/"] = requestHandlers.sendInterface
, handle["/main.css"] = requestHandlers.sendMainCss
, handle["/interface"] = requestHandlers.sendInterface
, handle["/plugins.js"] = requestHandlers.sendPluginJs
, handle["/main.js"] = requestHandlers.sendMainJs
, handle["/modernizr-2.6.2.min.js"] = requestHandlers.sendModernizr;

server.start(router.route,handle,debug);