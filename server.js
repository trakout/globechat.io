var fs = require('fs')
, http = require('http')
, socketio = require('socket.io')
, url = require("url")
, uuidGen = require('node-uuid');


var socketServer;
var CHAT_ROOMS = [];
var USERS_SOCKET_IDS = [];

// handle contains locations to browse to (vote and poll); pathnames.
function startServer(route,handle,debug)
{
    // on request event
    function onRequest(request, response) {
        // parse the requested url into pathname. pathname will be compared
        // in route.js to handle (var content), if it matches the a page will 
        // come up. Otherwise a 404 will be given. 
        var pathname = url.parse(request.url).pathname; 
        // console.log("Request for " + pathname + " received");
        var content = route(handle,pathname,response,request,debug);
    }
    
    var httpServer = http.createServer(onRequest).listen(1200, function(){
        console.log("Listening at: http://localhost:1200");
        console.log("Server is up");

    }); 

    initSocketIO(httpServer,debug);
}

function initSocketIO(httpServer,debug)
{
    socketServer = socketio.listen(httpServer);
    if(debug == false){
        socketServer.set('log level', 1); // socket IO debug off
    }
    socketServer.on('connection', function (socket) {
        console.log("user connected");

        keepTrackOfSocket(socket);

        // make the socket join a unique room
        socket.join('some-unqiue-room-id');

        // tell everyone the updated list of users online
        updateUsersWithOnlineUsers();

        socket.on('disconnect', function(){

            // remove user from the list of user online
            for (var i=0; i< USERS_SOCKET_IDS.length; ++i) {
                if (USERS_SOCKET_IDS[i] == socket.id) {
                    USERS_SOCKET_IDS.splice(i, 1);
                }
            }
            updateUsersWithOnlineUsers();
            console.log('user disconnected');
        });

        socket.on('acceptChatRequest', function (userId) {
            console.log('starting chat between '+userId+' and'+socket.id);
            socketServer.to(userId).emit('startChat', socket.id);
            socketServer.to(socket.id).emit('startChat', userId);
        });

        socket.on('chatMessage', function(msg){
            console.log('message: ' + msg);
            // send the message to everyone in the room
            socketServer.to('some-unqiue-room-id').emit('chatMessage', msg);
        });

        socket.on('sendChatRequest', function(userId) {
            console.log("sending chat request to:" + userId);
            socket.broadcast.to(userId).emit('receiveChatRequest', socket.id);
        });

        // socket.emit('onconnection', {pollOneValue:sendData});
    
        // socketServer.on('update', function(data) {
        //     socket.emit('updateData',data);
        // });

        // socket.on('mapGesture', function(data) {
        //     // console.log(exec('cliclick w:"3000" kp:"tab"'));
        //     KEY_MAP[data.gesture] = data.keys;
        //     // console.log(KEY_MAP[data.gesture]);
        // });

        // socket.on('switchedToFPS', function(data) {
        //     // console.log(exec('cliclick w:"3000" kp:"tab"'));
        //     // console.log(data);
        //     if (data)
        //         console.log("fps mode");
        //     else 
        //         console.log("normal mode");
        //     isFPSDemo = data;
        // });

        // socketServer.on('updateGesture', function(data) {
        //     socket.emit('updateGesture',data);
        // });

        // socketServer.on('updateLeap', function(data) {
        //     socket.emit('updateLeap', data);
        // }).on('leapState', function(data) {
        //     socket.emit('leapState', data);
        // });

    });
}

function keepTrackOfSocket(socket) {
    if (USERS_SOCKET_IDS.indexOf(socket.id) != -1) {
        return;
    }

    USERS_SOCKET_IDS.push(socket.id);
    console.log(USERS_SOCKET_IDS);
}

function updateUsersWithOnlineUsers() {
    socketServer.emit('listOfUsersOnline', USERS_SOCKET_IDS);
}

exports.start = startServer;