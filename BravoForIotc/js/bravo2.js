var c;
var ctx;
var cH;
var cW;
var bgColor = "#FF6138";
var animations = [];
var circles = [];
var animate;

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
	
});

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
//	document.addEventListener("touchstart", handleEvent);
//	document.addEventListener("mousedown", handleEvent);
	document.getElementById("bravoButton").addEventListener("click", handleEvent);
};

function handleEvent(e) {
		if (e.touches) { 
			e.preventDefault();
			e = e.touches[0];
		}
		var currentColor = colorPicker.current();
		var nextColor = colorPicker.next();
		var targetR = calcPageFillRadius(e.pageX, e.pageY);
		var rippleSize = Math.min(200, (cW * .4));
		var minCoverDuration = 750;
		
		var width  = Math.round((220 / $(window).width() + Math.random()) * ($(window).width() / 2 - 220));
		var height = Math.round((60 / $(window).height() + Math.random()) * ($(window).height() * 0.9 - 60));
		
		// bravoテキストをフェードイン・フェードアウト
		$(".bravo-text span").css({
			"color" : currentColor,
			"top"   : height - 50,
			"left"  : width - 70,
//			"top"   : e.pageY - 50,
//			"left"  : e.pageX - 70,
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
//			x: e.pageX,
//			y: e.pageY,
			x: width,
			y: height,
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
//			x: e.pageX,
//			y: e.pageY,
			x: width,
			y: height,
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
//				x: e.pageX,
//				y: e.pageY,
				x: width,
				y: height,
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
