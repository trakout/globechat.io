var fs = require('fs')
, http = require('http')
, socketio = require('socket.io')
, url = require("url")
, uuidGen = require('node-uuid')
, request = require('request')
, xml2js = require('xml2js')
, OpenTok = require('opentok');

var StatsD = require('node-dogstatsd').StatsD;
var dogstatsd = new StatsD();

var socketServer;
var opentok;
var rtc;
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

    opentok = new OpenTok("45102212", "b8fb8686a89bebab70b8f2be91b503f04d64ee14");
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

        var userObject = keepTrackOfSocket(socket);
        socket.emit('updatedUserObject', userObject);

        // tell everyone the updated list of users online
        updateUsersWithOnlineUsers();

        socket.on('disconnect', function(){
            dogstatsd.increment('server.disconnect');
            destroyUsersRoom(USER_SOCKET_OBJECTS[socket.id], false);
            delete USER_SOCKET_OBJECTS[socket.id];
            // TODO: also delete them from any chatrooms
            console.log("xxxManu CHAT ROOMS: " + JSON.stringify(CHAT_ROOMS));
            console.log("xxxManu USER_SOCKET_OBJECTS: " + JSON.stringify(USER_SOCKET_OBJECTS));

            updateUsersWithOnlineUsers();
            console.log('user disconnected');
        });

        socket.on('acceptChatRequest', function (userId) {
            dogstatsd.increment('server.acceptChatRequest');
            console.log('starting chat between '+userId+' and '+socket.id);

            createRoom(socket.id, userId, function (roomObject) {
                console.log(roomObject);
                socketServer.to(userId).emit('startChat', roomObject);
                socketServer.to(socket.id).emit('startChat', roomObject);
            });
            // socketServer.to(userId).emit('startChat', socket.id);
            // socketServer.to(socket.id).emit('startChat', userId);
        });

        socket.on('chatMessage', function(msg){
            dogstatsd.increment('server.chatMessage');
            var userObject = USER_SOCKET_OBJECTS[socket.id];
            msg = userObject.name + ": " + msg;
            if ("inRoom" in userObject) {
                var room = userObject.inRoom;
                socketServer.to([room]).emit('chatMessage', msg);
            }
            // send the message to everyone in the room
        });

        socket.on('transcribedText', function(msg) {
            var userObject = USER_SOCKET_OBJECTS[socket.id];
            msg = userObject.name + ": " + msg;
            if ("inRoom" in userObject) {
                var room = userObject.inRoom;
                socketServer.to([room]).emit('transcribedText', msg);
            }
        });

        socket.on('sendChatRequest', function(userId) {
            dogstatsd.increment('server.sendChatRequest');
            var userObject = USER_SOCKET_OBJECTS[socket.id];
            if (userObject) {
                console.log(socket.id+" sending chat request to:" + userObject.id);    
                socket.broadcast.to(userId).emit('receiveChatRequest', userObject);
            }
        });

        socket.on('changeName', function(name) {
            dogstatsd.increment('server.changeName');
            var userObject = USER_SOCKET_OBJECTS[socket.id];
            if (userObject) {
                userObject.name = name;
                console.log(name);
                updateUsersWithOnlineUsers();
            }
        });

        socket.on('sendSessionDescription', function(sessionDescription) {
            dogstatsd.increment('server.sendSessionDescription');
            var userObject = USER_SOCKET_OBJECTS[socket.id];
            
            if ('inRoom' in userObject) {
                var room = userObject.inRoom
                var currentRoom = CHAT_ROOMS[room];
                var currentUserObject;
                for (var i=0; i<currentRoom.users.length; ++i) {
                    currentUserObject = currentRoom.users[i];
                    console.log(currentUserObject.id+' = '+socket.id);
                    if (currentUserObject.id != socket.id) {
                        socket.broadcast.to(currentUserObject.id).emit('receivedSessionDescription', sessionDescription);
                    } 
                }
            }
        });

        socket.on('sendCandidateEvent', function(candidateEvent) {
            dogstatsd.increment('server.sendSessionDescription');
            var userObject = USER_SOCKET_OBJECTS[socket.id];
            
            if ('inRoom' in userObject) {
                var room = userObject.inRoom
                var currentRoom = CHAT_ROOMS[room];
                var currentUserObject;
                for (var i=0; i<currentRoom.users.length; ++i) {
                    currentUserObject = currentRoom.users[i];
                    console.log(currentUserObject.id+' = '+socket.id);
                    if (currentUserObject.id != socket.id) {
                        socket.broadcast.to(currentUserObject.id).emit('receivedCandidateEvent', candidateEvent);
                    } 
                }
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
    // userObject.inRoom = "[]";

    USER_SOCKET_OBJECTS[socket.id] = userObject;
    console.log(userObject);
    return userObject;
}

function updateUsersWithOnlineUsers() {
    socketServer.emit('listOfUsersOnline', USER_SOCKET_OBJECTS);
}

function destroyUsersRoom(userObject, userIsConnected) {
    if ('inRoom' in userObject) {
        var roomKey = userObject.inRoom;
        var users = CHAT_ROOMS[roomKey].users;
        var userSocket = null;

        if (userIsConnected) {
            userSocket = socketServer.sockets.connected[userObject.id];
            userSocket.leave(roomKey)
        }

        for (var i=0; i<users.length; ++i) {
            var otherUser = users[i];
            if (otherUser.id != userObject.id) {
                userSocket = socketServer.sockets.connected[otherUser.id]
                //TODO: notify other user that he has been disconnected
                delete otherUser['inRoom']
                userSocket.leave(roomKey)
            }
        }

        delete CHAT_ROOMS[roomKey]
    }
}

function createRoom(user1, user2, callback) {

    opentok.createSession(function(err, session) {
        if (err) return console.log(err);

        token = opentok.generateToken(session.sessionId);

        console.log('generated open tok session id: ' + session.sessionId);
        if (!session.sessionId) {
            return;
        }

        var roomId = session.sessionId;
        console.log("creating room: " + roomId);
        var roomObject = {};
        roomObject.id = roomId;
        roomObject.token = token;

        var user1Socket = socketServer.sockets.connected[user1];
        var user2Socket = socketServer.sockets.connected[user2];

        var userObject1 = USER_SOCKET_OBJECTS[user1];
        var userObject2 = USER_SOCKET_OBJECTS[user2];


        if (user1Socket && user2Socket && userObject1 && userObject2) {
            user1Socket.join(roomId);
            user2Socket.join(roomId);
            roomObject.users = [USER_SOCKET_OBJECTS[user1], USER_SOCKET_OBJECTS[user2]];

            destroyUsersRoom(userObject1, true)
            destroyUsersRoom(userObject2, true)

            userObject1.inRoom = roomId;
            userObject2.inRoom = roomId;
            CHAT_ROOMS[roomId] = roomObject;
        }

        callback(roomObject);
    });

        
}

function createSessonFromOpenTok(callback) {
    var options = {
        url: 'https://api.opentok.com/hl/session/create',
        headers: {
            'X-TB-PARTNER-AUTH': '45102212:b8fb8686a89bebab70b8f2be91b503f04d64ee14'
        }
    };
    request.post(options, function cb(err, httpResponse, body) {
        if (err) {
            return console.log(err);
        }
        var parser = new xml2js.Parser();
        parser.parseString(body, function (err, result) {
            return callback(result['sessions']['Session'][0]['session_id'][0]);
        });
    });
}

exports.start = startServer;