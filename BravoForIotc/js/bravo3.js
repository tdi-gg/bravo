var c;
var ctx;
var cH;
var cW;
var bgColor = "#FF6138";
var animations = [];
var circles = [];
var animate;
var modalwindowFlag = 0;
var selectSpeakerFlag = 2;

$(document).ready(function() {
	$(".bravo-text").fadeOut(10);
	
	// コメント送信ボタン押下時イベントの登録
	$("#sendCommentButton").on("click", function() {
		sendComment();
	});
	
	c = document.getElementById("c");
	ctx = c.getContext("2d");
	bgColor = "#FF6138";
	animations = [];
	circles = [];
	
	animate = anime({
		duration: Infinity,
		update: function() {
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, cW, cH);
			animations.forEach(function(anim) {
				anim.animatables.forEach(function(animatable) {
					animatable.target.draw();
				});
			});
		}
	});
	
	resizeCanvas();
	if (window.CP) {
		// CodePen's loop detection was causin' problems
		// and I have no idea why, so...
		window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000; 
	}
	window.addEventListener("resize", resizeCanvas);
	addClickListeners();
	if (!!window.location.pathname.match(/fullcpgrid/)) {
		startFauxClicking();
	}
	handleInactiveUser();
	
	// アイコンの表示
	drawIcon();
	$(window).on("resize", function(){
		drawIcon();
	});
	
	// 時計表示
	var height = $(window).height() * 0.15;
	var width  = $(window).width() * 0.03;
	$("span#clock").css({
		"font-size" : "50px",
		"top"  : -height,
		"left" : width
	});
	showClock();
	setInterval("showClock()", 1000);
	
	// スピーカー選択のセレクトボックスを表示
	showSpeakerSelect();

});

/**
 * スピーカー情報を全県取得します。
 */
var getAllSpeakers = function() {
    return new Promise(function(resolve, reject){
    	$.ajax({
    		dataType    : "json",
    		type        : "GET",
    		url         : "https://ka5oga2jzh.execute-api.ap-northeast-1.amazonaws.com/prod/iotc_bravo_getAllSpeaker",
    		xhrFields   : {
                withCredentials: true
            },
    		success     : function(data) {
    			console.log("success", data);
    			resolve(data);
    		},
    		error       : function(data) {
    			alert("error!");
    			console.log("error", data)
    		}
    	});
    });
}

/**
 * スピーカー選択のセレクトボックスを表示
 */
var showSpeakerSelect = function() {
	
	getAllSpeakers().then((speakers) => {
		console.log("speakers", speakers);
		var speakerSelect = $("ul.menu")[0];
		for (var i = 0; i < speakers.length; i++) {
			speakerSelect.append("<li>" + speakers.SPEAKER_NAME + "</li>");
		}
	});
	
	$("span.dropdown").offset({
		"top" : $(window).height() * 0.01,
		"left" : $(window).width() * 0.03
	});
	
	$(".dropdown").click(function(){
		
		if ($("ul.menu").hasClass("showMenu") && selectSpeakerFlag != 2) {
			selectSpeakerFlag = 0;
		} else if (selectSpeakerFlag != 2) {
			selectSpeakerFlag = 1;
		}
		
		var selectOffset = $("span.dropdown").offset();
		$("ul.menu").offset({
			"top"  : selectOffset.top + 200,
			"left" : selectOffset.left
		});
		
		$(".menu").toggleClass("showMenu");
		$(".menu > li").click(function(){
			selectSpeakerFlag = 0;
			$(".dropdown > .p").html($(this).html());
			$(".menu").removeClass("showMenu");
		});
	});
}

/**
 * コメントを取得します。
 */
var getComments = function(commentViewPanel) {
	return new Promise(function(resolve, reject) {
		var comments = [
			{
				"id"      : "001",
				"comment" : "comment1",
				"user"    : "user1",
				"type"    : "comment"
			},
			{
				"id"      : "002",
				"comment" : "comment2",
				"user"    : "user2",
				"type"    : "question"
			},
			{
				"id"      : "003",
				"comment" : "comment3",
				"user"    : "user3",
				"type"    : "comment"
			},
			{
				"id"      : "004",
				"comment" : "comment4",
				"user"    : "user4",
				"type"    : "question"
			},
			{
				"id"      : "001",
				"comment" : "comment1",
				"user"    : "user1",
				"type"    : "comment"
			},
			{
				"id"      : "002",
				"comment" : "comment2",
				"user"    : "user2",
				"type"    : "question"
			},
			{
				"id"      : "003",
				"comment" : "comment3",
				"user"    : "user3",
				"type"    : "comment"
			},
			{
				"id"      : "004",
				"comment" : "comment4",
				"user"    : "user4",
				"type"    : "question"
			},
			{
				"id"      : "001",
				"comment" : "comment1",
				"user"    : "user1",
				"type"    : "comment"
			},
			{
				"id"      : "002",
				"comment" : "comment2",
				"user"    : "user2",
				"type"    : "question"
			},
			{
				"id"      : "003",
				"comment" : "comment3",
				"user"    : "user3",
				"type"    : "comment"
			},
			{
				"id"      : "004",
				"comment" : "comment4",
				"user"    : "user4",
				"type"    : "question"
			},
			{
				"id"      : "005",
				"comment" : "comment5",
				"user"    : "user5",
				"type"    : "comment"
			}
		];
		
		// コメント一覧の作成
		for (var i = 0; i < comments.length; i++) {
			var commentId = comments[i]["id"];
			var comment = $("<span>").attr({
				"id"    : commentId,
				"class" : "comment"
			});
			commentViewPanel.append(comment);
			
			// コメントタイプの追加
			comment.append($("<span id='commentType" + commentId + "' class='comment-type'>" + comments[i]["type"] + "</span>"));
			comment.append($("<span id='commentText" + commentId + "' class='comment-text'>" + comments[i]["comment"] + "</span>"));
			comment.append($("<span id='commentUser" + commentId + "' class='comment-user'>" + comments[i]["user"] + "</span><br>"));
		}
		
		resolve(commentViewPanel);
	});
}

/**
 * アイコンの表示をします。
 */
var drawIcon = function() {
	var height = $(window).height() * 0.15;
	var width  = $(window).width() * 0.6;
	var contentHeight = $(window).height() * 0.1;
	
	// グラフアイコンの表示
	$("#graphIcon").css({
		"top"  : -height,
		"left" : width
	});
	$("#graphIcon").height(contentHeight + "px");
	
	// コメントアイコンの表示
	$("#commentIcon").css({
		"top"  : -height,
		"left" : width,
		"padding-left" : $(window).height() * 0.01
	});
	$("#commentIcon").height(contentHeight + "px");
	
	// コメント表示アイコンの表示
	$("#eyeIcon").css({
		"top"  : -height,
		"left" : width,
		"padding-left" : $(window).height() * 0.01
	});
	$("#eyeIcon").height(contentHeight + "px");
	
	// コメントアイコンクリック時
	$("#commentIcon").on("click", function() {
		modalwindowFlag = 1;
		
		// コメント画面の表示
		var commentPanel = $("<span>", {
			"id" : "commentPanel"
		});
		
		// コメント入力欄
		$("<textarea>").attr({
			"id"          : "comment",
			"cols"        : "100",
			"rows"        : "10",
			"placeholder" : "コメントを入力してください。"
		}).appendTo(commentPanel);
		
		// コメント送信ボタン
		$("<input>").attr({
			"type"  : "button",
			"id"    : "sendCommentButton",
			"class" : "button",
			"value" : "コメント送信"
		}).appendTo(commentPanel);
		
		// モーダルウィンドウでコメント画面を表示
		windowutil.modalWindow("#modalContent", commentPanel);
	});
	
	// コメントアイコンクリック時
	$("#eyeIcon").on("click", function() {
		modalwindowFlag = 1;
		
		// コメント画面の表示
		var commentViewPanel = $("<span>", {
			"id" : "commentViewPanel"
		});
		
		// コメントの取得
		getComments(commentViewPanel).then(commentViewPanel => {			
			// モーダルウィンドウでコメント画面を表示
			windowutil.modalWindow("#modalContent", commentViewPanel);
		});
		
	});
}

var showClock = function() {
	var nowTime = new Date(); //  現在日時を得る
	var nowHour = ("0" + nowTime.getHours()).slice(-2); // 時を抜き出す
	var nowMin  = ("0" + nowTime.getMinutes()).slice(-2); // 分を抜き出す
	var nowSec  = ("0" + nowTime.getSeconds()).slice(-2); // 秒を抜き出す
	var msg = nowHour + ":" + nowMin + ":" + nowSec;
	$("span#clock").text(msg);
}

/**
 * コメントを送信します。
 */
var sendComment = function() {
	var comment = $("#comment").val();
	$("#commentDisplayPanel").append("<div>" + comment + "</div>");
};

var colorPicker = (function() {
	var colors = ["#FF6138", "#FFBE53", "#2980B9", "#282741"];
	var index = 0;
	function next() {
		index = index++ < colors.length-1 ? index : 0;
		return colors[index];
	}
	function current() {
		return colors[index]
	}
	return {
		next: next,
		current: current
	}
})();

function removeAnimation(animation) {
	var index = animations.indexOf(animation);
	if (index > -1) animations.splice(index, 1);
}

function calcPageFillRadius(x, y) {
	var l = Math.max(x - 0, cW - x);
	var h = Math.max(y - 0, cH - y);
	return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
}

function addClickListeners() {
	document.addEventListener("touchstart", handleEvent);
	document.addEventListener("mousedown", handleEvent);
//	document.getElementById("bravoButton").addEventListener("click", handleEvent);
};

/**
 * bravo情報を登録する
 */
var registBravo = function() {
	$.ajax({
		contentType : "application/json",
		data        : JSON.stringify({
			"AUDIENCE_ID" : "0001",
			"TEST"        : "test"
		}),
		dataType    : "json",
		type        : "POST",
		url         : "https://ka5oga2jzh.execute-api.ap-northeast-1.amazonaws.com/prod/bravo_iotc_comment",
		xhrFields   : {
            withCredentials: true
        },
		success     : function(data) {
			console.log("success", data);
		},
		error       : function(data) {
			alert("error!");
			console.log("error", data)
		}
	});
}

function handleEvent(e) {
	
	// アイコンの表示領域を取得
	var xStart = $("#graphIcon").offset().left;
	var yStart = $("#graphIcon").offset().top;
	var xEnd   = $("#eyeIcon").offset().left + $("#eyeIcon").width();
	var yEnd   = $("#eyeIcon").offset().top + $("#eyeIcon").height();
	
	// スピーカー選択の表示領域を取得
	var xStartSpeaker = $("span.dropdown").offset().left;
	var yStartSpeaker = $("span.dropdown").offset().top;
	var xEndSpeaker = $("span.dropdown").offset().left + $("span.dropdown").width();
	var yEndSpeaker = $("span.dropdown").offset().top + $("span.dropdown").height();
	
	// アイコンの表示領域内がクリックされていたらアニメーションを起こさない
	// モーダルウィンドウ表示時もアニメーションを起こさない
	if ((xStart <= e.x && e.x <= xEnd) && (yStart <= e.y && e.y <= yEnd) 
			|| (xStartSpeaker <= e.x && e.x <= xEndSpeaker) && (yStartSpeaker <= e.y && e.y <= yEndSpeaker) 
			|| modalwindowFlag != 0 
			|| selectSpeakerFlag != 0) {
		return;
	}
	
	if (e.touches) { 
		e.preventDefault();
		e = e.touches[0];
	}
	var currentColor = colorPicker.current();
	var nextColor = colorPicker.next();
	var targetR = calcPageFillRadius(e.pageX, e.pageY);
	var rippleSize = Math.min(200, (cW * .4));
	var minCoverDuration = 750;
	
	// bravoテキストをフェードイン・フェードアウト
	$(".bravo-text span").css({
		"color" : currentColor,
		"top"   : e.pageY - 50,
		"left"  : e.pageX - 100,
		"position" : "absolute"
	});
	
	// コメントの文字色を変更
	$("#commentDisplayPanel").css({
		"color" : currentColor
	});

	var bravoText = $(".bravo-text");
	bravoText.stop(true, true).fadeIn(1000);
	bravoText.stop(true, true).fadeOut(1000);
	
	var pageFill = new Circle({
		x: e.pageX,
		y: e.pageY,
		r: 0,
		fill: nextColor
	});
	var fillAnimation = anime({
		targets: pageFill,
		r: targetR,
		duration:	Math.max(targetR / 2 , minCoverDuration ),
		easing: "easeOutQuart",
		complete: function(){
			bgColor = pageFill.fill;
			removeAnimation(fillAnimation);
		}
	});
	
	var ripple = new Circle({
		x: e.pageX,
		y: e.pageY,
		r: 0,
		fill: currentColor,
		stroke: {
			width: 3,
			color: currentColor
		},
		opacity: 1
	});
	var rippleAnimation = anime({
		targets: ripple,
		r: rippleSize,
		opacity: 0,
		easing: "easeOutExpo",
		duration: 900,
		complete: removeAnimation
	});
	
	var particles = [];
	for (var i=0; i<32; i++) {
		var particle = new Circle({
			x: e.pageX,
			y: e.pageY,
			fill: currentColor,
			r: anime.random(24, 48)
		})
		particles.push(particle);
	}
	var particlesAnimation = anime({
		targets: particles,
		x: function(particle){
			return particle.x + anime.random(rippleSize, -rippleSize);
		},
		y: function(particle){
			return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
		},
		r: 0,
		easing: "easeOutExpo",
		duration: anime.random(1000,1300),
		complete: removeAnimation
	});
	
	animations.push(fillAnimation, rippleAnimation, particlesAnimation);
	
	// bravo情報を登録
	registBravo();
}

function extend(a, b){
	for(var key in b) {
		if(b.hasOwnProperty(key)) {
			a[key] = b[key];
		}
	}
	return a;
}

var Circle = function(opts) {
	extend(this, opts);
}

Circle.prototype.draw = function() {
	ctx.globalAlpha = this.opacity || 1;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
	if (this.stroke) {
		ctx.strokeStyle = this.stroke.color;
		ctx.lineWidth = this.stroke.width;
		ctx.stroke();
	}
	if (this.fill) {
		ctx.fillStyle = this.fill;
		ctx.fill();
	}
	ctx.closePath();
	ctx.globalAlpha = 1;
}

var resizeCanvas = function() {
	c = document.getElementById("c");
	cW = window.innerWidth;
	cH = window.innerHeight;
	c.width = cW * devicePixelRatio;
	c.height = cH * devicePixelRatio;
	ctx.scale(devicePixelRatio, devicePixelRatio);
};

function handleInactiveUser() {
	var inactive = setTimeout(function(){
		fauxClick(cW/2, cH/2);
	}, 2000);
	
	function clearInactiveTimeout() {
		clearTimeout(inactive);
		document.removeEventListener("mousedown", clearInactiveTimeout);
		document.removeEventListener("touchstart", clearInactiveTimeout);
	}
	
	document.addEventListener("mousedown", clearInactiveTimeout);
	document.addEventListener("touchstart", clearInactiveTimeout);
}

function startFauxClicking() {
	setTimeout(function(){
		fauxClick(anime.random( cW * .2, cW * .8), anime.random(cH * .2, cH * .8));
		startFauxClicking();
	}, anime.random(200, 900));
}

function fauxClick(x, y) {
	var fauxClick = new Event("mousedown");
	fauxClick.pageX = x;
	fauxClick.pageY = y;
	document.dispatchEvent(fauxClick);
}
