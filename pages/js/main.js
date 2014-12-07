
function runSocket() {
	$('#conversationSection').hide();

	var _userObject;

	/*************************************************************************************

	* BUTTON HANDLER RELATED STUFF

	*************************************************************************************/

	$('#onlineUsers').on('click','li.onlineUser',function() {    
		requestToChatWithUser($(this).data("user-id"));
	});

	$('#chatRequests').on('click','li.chatRequest',function() {    
		console.log($(this).data("user-id"));
		acceptChatRequest($(this).data("user-id"));
	});

	/*************************************************************************************

	* VIDEO RELATED STUFF

	*************************************************************************************/

	function startOpenTok(roomObject) {
		console.log(roomObject);
		var apiKey = "45102212";
		var session = OT.initSession(apiKey, roomObject.id);

		session.on("streamCreated", function(event) {
			console.log('OpenTok stream created');
			session.subscribe(event.stream);
		});

		session.connect(roomObject.token, function(error) {
			console.log('OpenTok session connected');
			var publisher = OT.initPublisher();
			session.publish(publisher);
		});
	}

	/*************************************************************************************

	* SOCKET RELATED STUFF

	*************************************************************************************/
	var socket = io();
	$('#conversationForm').submit(function(){

		// send to the server the message
		socket.emit('chatMessage', $('#messageInput').val());
			$('#messageInput').val('');
		return false;
	});

	$('#changeNameForm').submit(function(){

		// send to the server the message
		socket.emit('changeName', $('#usernameInput').val());
		return false;
	});

	// recieved message
	socket.on('chatMessage', function(msg){
		$('#conversationTranscript').append($('<li>').text(msg));
	});

	socket.on('startChat', function (roomObject) {
		console.log('starting chat');
		$('#conversationSection').show();

		startOpenTok(roomObject);
	});

	socket.on('receiveChatRequest', function (userObject) {
		console.log("recieved: "+ userObject);
		if ($('#chatRequests').find('[data-user-id="' + userObject.id + '"]').length == 0) {
			$('#chatRequests').append('<li class="chatRequest" data-user-id="'+userObject.id+'">'+userObject.name+'</li>');
		}
	});

	socket.on('updatedUserObject', function (userObject) {
		_userObject = userObject;
		$('#usernameInput').val(userObject.name);
	});

	// recieved a list of people online
	// NOTE: this will probably be a list of objects later, right now it is strings
	socket.on('listOfUsersOnline', function(userArray) {

		// refresh the list of online users
		$('#onlineUsers').empty();
		var keys = Object.keys(userArray);
		for (var i=0; i<keys.length; ++i) {
			var userObject = userArray[keys[i]];
			if (userObject.id != _userObject.id) {
				$('#onlineUsers').append('<li class="onlineUser" data-user-id="'+userObject.id+'">'+userObject.name+'</li>');
			}
		}
	});

	socket.on('receivedSessionDescription', function(sessionDescription) {
		console.log('received session description: ' + sessionDescription);
	});

	socket.on('receivedCandidateEvent', function(candidateEvent) {
		console.log('got candidate event');
		var candidate = new RTCIceCandidate({
			sdpMLineIndex: candidateEvent.label,
			candidate: candidateEvent.candidate
		});
	});

	function requestToChatWithUser(userId) {
		socket.emit('sendChatRequest', userId);
	}

	function acceptChatRequest(userId) {
		socket.emit('acceptChatRequest', userId);
	}

	// function sendCandidateEvent(event) {
	// 	socket.emit('sendCandidateEvent', {
	// 		type: 'candidate',
	// 		label: event.candidate.sdpMLineIndex,
	// 		id: event.candidate.sdpMid,
	// 		candidate: event.candidate.candidate
	// 	});
	// }

	// function sendSessionDescription(sessionDescription) {
	// 	console.log('sending session description');
	// 	socket.emit('sendSessionDescription', sessionDescription);
	// }
} // runSocket


function sendString(val) {
	console.log('this was sent: ' + val);


	
	// run socket to other peer
}

// keyboard shortcuts
$('.text-submit textarea').bind('keydown', function(e) {
	var code = e.keyCode || e.which;
	if (code == 13 && e.shiftKey == false && ($('.text-submit textarea').val().length > 0)) { 

		var testText = $('.text-submit textarea').val();
		var matches = testText.match(/\n/g);
		var breaks = matches ? matches.length : 0;

		if (!(($('.text-submit textarea').val().length == 1) && (breaks == 1))) {
			// if no breaks, then this's an enter/submit key
			sendString($('.text-submit textarea').val());
			TweenMax.to('.text-submit textarea', 0.2, {opacity:0, onComplete:function() {
				$('textarea').val('');
				TweenMax.to('.text-submit textarea', 0.1, {opacity:1});
			}}); // tweenmax
		} else {
			$('textarea').val('');
			// user submitting blank data, disallowed
		}
	} 
});

function autoResize(e) {
	var ele = e.target;
    var t = ele.scrollTop;
    ele.scrollTop = 0;
    var max = $('.text-area').height() - 30;
    var tarHeight;

	if (!((e.shiftKey == false) && (e.keyCode == 13 || e.which == 13))) {
	    if ((ele.offsetHeight + t + t) > max) {
	    	tarHeight = max;
	    } else {
	    	tarHeight = ele.offsetHeight + t + t;
	    }
	    if ($('textarea').val().length == 0) {
	    	ele.style.height = "14px";
	    	$('.text-submit').css('height', "30px");
	    }
	    if (t > 0) {
	        // console.log(tarHeight);
	        ele.style.height = (tarHeight - 16) + "px";
	        $('.text-submit').css('height', (tarHeight) + "px");
	    }
	} else {
		ele.style.height = "14px";
    	$('.text-submit').css('height', "30px");
	}
}

function runResizes() {
	$('.recipient').resizable({
		resize: function() {
			$('.text-area').css('height', ($('body').height() - $('.recipient').height() + 'px'));
		},
		maxHeight: $('body').height() * .85,
		minHeight: $('body').height() * .15,
		handles: 's'
	});
	$('.viewer').resizable({
		aspectRatio:true,
		maxWidth: $('.recipient').width() / 2,
		minWidth: 50,
		handles: 'e'
	});
}

function checkDom() {
	if ($('.chat').length > 0) {
		runResizes();
	}
}

$(document).ready(function() {
	checkDom();
	runSocket();
});