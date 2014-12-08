var publisher, session, apiKey, socket, imageCount = 0, shared;

function runSocket() {
	$('#conversationSection').hide();

	var _userObject;
	var _rec;

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

	$('#userLanguage').on('change', function (e) {
		var optionSelected = $(this).find("option:selected");
		var valueSelected  = optionSelected.val();
		changeUserLanguage(valueSelected);
	});

	/*************************************************************************************

	* SPEECH RECOGNITION RELATED STUFF

	*************************************************************************************/

	function startSpeechRecognition() {

		_rec = new webkitSpeechRecognition();
		_rec.continuous = true; 
		_rec.interimResults = true;
		_rec.lang = _userObject.language;
		
		_rec.onresult = function(e) {
			for (var i = e.resultIndex; i < e.results.length; ++i) { 
				if (e.results[i].isFinal) { 
					// $('#transcribedText').append($('<li>').text(_userObject.name+': '+e.results[i]['0'].transcript.trim()));
					console.log('sending text to transcibe: '+e.results[i]['0'].transcript.trim());
					sendTranscribedText(e.results[i]['0'].transcript.trim());
				}
			}
		}
		
		_rec.onstart = function () {
			console.log('webkitSpeechRecognition started');
		}
		
		_rec.onerror = function(event) {
			console.log('webkitSpeechRecognition error ' + event.error);
			_rec.start();    // I added it here, because I think it dies after there is an error, or I might just have slow internet
		}
		
		_rec.start();
	}

	function stopSpeechRecognition() {
		_rec = null;
	}

	/*************************************************************************************

	* VIDEO RELATED STUFF

	*************************************************************************************/

	function startOpenTok(roomObject, otherUserLocationData) {

		shared = otherUserLocationData;

		apiKey = "45102212";
		session = OT.initSession(apiKey, roomObject.id);


		session.on("streamCreated", function(event) {
			console.log('OpenTok stream created');
			session.subscribe(event.stream, 'videoPublish');
		});

		session.connect(roomObject.token, function(error) {
			console.log('OpenTok session connected');
			// publisher = OT.initPublisher(apiKey, 'videoPublish');
			// session.publish(publisher);
			// moved to loadChatRoom
			loadChatRoom(shared);
		});
	}

	/*************************************************************************************

	* SOCKET RELATED STUFF

	*************************************************************************************/

	socket = io();

	// $('#conversationForm').submit(function(){

	// 	// send to the server the message
	// 	socket.emit('chatMessage', $('#messageInput').val());
	// 		$('#messageInput').val('');
	// 	return false;
	// });
	// ^^^^ moved to sendString

	$('#changeNameForm').submit(function(){

		// send to the server the message
		socket.emit('changeName', $('#usernameInput').val());
		return false;
	});

	// recieved message
	socket.on('chatMessage', function(msg){
		$('#conversationTranscript').append($('<li class="normal">').text(msg));
	});

	socket.on('transcribedText', function(msg){
		if ($('#conversationSection h3').length > 0) {
			$('#conversationSection h3').fadeOut('fast', function() {
				$('#conversationSection h3').remove();
			});
		}
		$('#conversationTranscript').append($('<li class="transcribed">').text(msg));
	});

	socket.on('startChat', function (roomObject, otherUserLocationData) {
		console.log('starting chat');

		$('#conversationSection').show();

		startOpenTok(roomObject, otherUserLocationData);
		startSpeechRecognition();
	});

	socket.on('receiveChatRequest', function (userObject) {
		console.log("recieved: "+ userObject);
		if ($('#chatRequests').find('[data-user-id="' + userObject.id + '"]').length == 0) {
			$('html, body').animate({
                scrollTop: $("h3.requestTop").offset().top
            }, 300);
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
			console.log(userObject);
			if (userObject.hasOwnProperty('image')) {
				if (userObject.id != _userObject.id) {
					$('#onlineUsers').append('<li class="onlineUser" data-user-id="'+userObject.id+'">' + userObject.name + '<img src="data:image/png;base64,' + userObject.image + '" /></li>');
				}
			} else {
				if (userObject.id != _userObject.id) {
					$('#onlineUsers').append('<li class="onlineUser" data-user-id="'+userObject.id+'">' + userObject.name + '</li>');
				}
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

	function sendTranscribedText(text) {
		socket.emit('transcribedText', text);
	}

	function changeUserLanguage(language) {
		socket.emit('changeUserLanguage', language);
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

function loadChatRoom(otherUserLocationData) {
	console.log('loading');
	var useThis = otherUserLocationData;

	console.log(useThis);
	$('body').fadeOut('fast', function() {
		$('body').load('/chat.html .chat-parent', function() {
			publisher = OT.initPublisher(apiKey, 'videoSelfie');
			session.publish(publisher, function() {
				if (imageCount == 0) {
					imageCount++; // send this only once
					var imgData = publisher.getImgData();
					socket.emit('userImage', imgData);
				}
			});
			$('body').fadeIn('fast');

			loadDrawer(useThis);
			// $('.drawer .location').html(otherUserLocationData);
			checkDom();
		});
	});
}

function sendString(val) {
	if ($('#conversationSection h3').length > 0) {
		$('#conversationSection h3').fadeOut('fast', function() {
			$('#conversationSection h3').remove();
		});
	}
	socket.emit('chatMessage', val);
}

function loadDrawer(ughghghgh) {
	var val = JSON.parse(ughghghgh);

	console.log(val);
	$('.drawer .location .city').html(val.city);
	$('.drawer .location .country').html(val.country);
	$('.drawer .location .time').html(val.city);

	$('.drawer .weather .icon').html('<img src="' + val.icon + '" />');
	$('.drawer .weather .temp').html(Math.round(val.temperature) + ' <span class="helv">&#176;</span>C <br>' + val.weather);

	var d = new Date(val.local_time);
	var m = d.getMinutes();
	var h = d.getHours();

	$('.drawer .time').html('Local Time: <br>' + m + ':' + h);

} // loadDrawer

// keyboard shortcuts
function enterShort() {

	$('.text-button').click(function() {
		sendString($('.text-submit textarea').val());
		TweenMax.to('.text-submit textarea', 0.2, {opacity:0, onComplete:function() {
			$('textarea').val('');
			TweenMax.to('.text-submit textarea', 0.1, {opacity:1});
		}}); // tweenmax
	});

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
} // enterShort

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
		enterShort();
	}
	$("input:text").each(function ()
	{
	    // store default value
	    var v = this.value;

	    $(this).blur(function ()
	    {
	        // if input is empty, reset value to default 
	        if (this.value.length == 0) this.value = v;
	    }).focus(function ()
	    {
	        // when input is focused, clear its contents
	        this.value = "";
	    }); 
	});
}

$(document).ready(function() {
	checkDom();
	runSocket();
});