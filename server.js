var fs = require('fs')
, http = require('http')
, socketio = require('socket.io')
, url = require("url")
, uuidGen = require('node-uuid');

var socketServer;
var CHAT_ROOMS = {};
var USER_SOCKET_OBJECTS = {};

// handle contains locations to browse to pathnames.
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
        console.log("Server is up at: http://localhost:1200");
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

            delete USER_SOCKET_OBJECTS[socket.id];

            updateUsersWithOnlineUsers();
            console.log('user disconnected');
        });

        socket.on('acceptChatRequest', function (userId) {
            console.log('starting chat between '+userId+' and '+socket.id);

            var roomId = createRoom(socket.id, userId);
            socketServer.to(userId).emit('startChat', socket.id);
            socketServer.to(socket.id).emit('startChat', userId);
        });

        socket.on('chatMessage', function(msg){
            var userObject = USER_SOCKET_OBJECTS[socket.id];
            var rooms = userObject.inRoom;
            if (rooms) {
                socketServer.to(rooms).emit('chatMessage', msg);    
            }
            // send the message to everyone in the room
            
        });

        socket.on('sendChatRequest', function(userId) {
            var userObject = USER_SOCKET_OBJECTS[socket.id];
            if (userObject) {
                console.log(socket.id+" sending chat request to:" + userObject.id);    
                socket.broadcast.to(userId).emit('receiveChatRequest', userObject);
            }
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

    if (USER_SOCKET_OBJECTS[socket.id]) {
        return;
    }

    var userObject = {};
    userObject.id = socket.id;
    userObject.name = "name_" + uuidGen.v4();
    userObject.inRoom = [];

    USER_SOCKET_OBJECTS[socket.id] = userObject;
    console.log(userObject);
}

function updateUsersWithOnlineUsers() {
    socketServer.emit('listOfUsersOnline', USER_SOCKET_OBJECTS);
}

function createRoom(user1, user2) {

    var roomId = uuidGen.v4();
    console.log("creating room: " + roomId);
    var roomObject = {};
    roomObject.id = roomId;

    var user1Socket = socketServer.sockets.connected[user1];
    var user2Socket = socketServer.sockets.connected[user2];

    var userObject1 = USER_SOCKET_OBJECTS[user1];
    var userObject2 = USER_SOCKET_OBJECTS[user2];


    if (user1Socket && user2Socket && userObject1 && userObject2) {
        user1Socket.join(roomId);
        user2Socket.join(roomId);
        roomObject.users = [USER_SOCKET_OBJECTS[user1], USER_SOCKET_OBJECTS[user2]];
        userObject1.inRoom.push(roomId);
        userObject2.inRoom.push(roomId);
        CHAT_ROOMS[roomId] = roomObject;
    }
}

exports.start = startServer;