

function sendString(val) {
	console.log('this was sent: ' + val);

	
	// run socket to other peer
}

// keyboard shortcuts
$('.text-submit textarea').bind('keyup', function(e) {
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
});