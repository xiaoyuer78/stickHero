// JavaScript Document
var stickHero=function(opt){
	_this = this;
	_this.oBox = document.getElementById("box");
	_this.oCon = document.getElementById("content");
	//场景物体
	_this.oLeft = document.getElementById("left");
	_this.oMiddle = document.getElementById("middle");
	_this.oRight = document.getElementById("right");
	_this.oHero = document.getElementById("hero");
	_this.oStick = document.getElementById("stick");
	
	_this.oGameover = document.getElementById("gameover");
	_this.oScore = document.getElementById("score");	
	
	_this.zindex = 0;
	_this.step = 0;		//关卡数
	_this.score = 0;		//分数
	_this.runing = false;	//是否在运动
	_this.timer = null;
	
	//计算画布数据
	_this.boxW = _this.oBox.offsetWidth;
	_this.conW = _this.boxW*2;
	_this.H = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;	
			
	_this.oCon.style.height = _this.H+"px";
	_this.oBox.style.height = _this.H+"px";		
	
	//实现PC手机都能兼容
	var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
	var hasTouch = 'ontouchstart' in window && !isTouchPad;
	_this.touchStart = hasTouch ? 'touchstart' : 'mousedown';
	_this.touchMove = hasTouch ? 'touchmove' : 'mousemove';
	_this.touchEnd = hasTouch ? 'touchend' : 'mouseup';
		
	//初始化
	_this.init();
}

//生成中间块
stickHero.prototype.init = function(){	
	
	_this.runing = false;	//修改为未运动
	
	var mwidth = _this.getRanWidth(_this.oLeft,30,200);
	var mleft = getRandom(_this.oLeft.offsetWidth+20,_this.boxW-_this.mwidth);
	_this.oMiddle.style.width = mwidth+"px";
	_this.oMiddle.style.left = mleft+"px";
	
	//生成第三个块（备用）
	_this.createRight(_this.oMiddle,30,200);
	
	_this.oHero.style.left = _this.oLeft.offsetWidth-_this.oHero.offsetWidth+"px";
	_this.oHero.style.bottom = "200px";
	_this.oHero.style.backgroundImage = "url(images/hero.gif)";
	_this.oHero.style.transition = "none";
	_this.oStick.style.left = _this.oLeft.offsetWidth-_this.oStick.offsetWidth+"px";
	_this.oStick.style.height = "0";
	_this.oStick.style.transform = "Rotate(0deg)";
	_this.oStick.style.transition = "none";
	
	_this = _this;
	document.addEventListener(_this.touchStart, MouseD,false);
	function MouseD(){
		console.log("按下1");
		console.log(_this.runing);
		_this.zindex++;
		//如果在运动中，直接返回false
		if(_this.runing){
			return false;
		}
		console.log("按下2");
		clearInterval(_this.timer);
		_this.timer = setInterval(function(){
			_this.oStick.style.height = _this.oStick.offsetHeight+3+"px";
		},10);
	}
	//鼠标抬起棍子倒下
	document.addEventListener(_this.touchEnd, MouseU,false);
	function MouseU(){
		//如果小人已掉下，直接返回false
		if(_this.runing){
			return false;
		}
		clearInterval(_this.timer);
		_this.runing = true;
		document.getElementById("jiaoti").play();
		_this.oHero.style.backgroundImage = "url(images/hero_t.gif)";
		//oStick.style.transition = "transform 0.3s linear";
		//oStick.style.WebkitTransition = "transform 0.3s linear" ;
		
		_this.oStick.style.transition = "0.3s linear";
		_this.oStick.style.WebkitTransition = "0.3s linear";
		_this.oStick.style.transform = "Rotate(90deg)";
		_this.oStick.style.WebkitTransform = "Rotate(90deg)";
		addEnd(_this.oStick,_this.panduan);
	}
}	
	
//棍子倒下后，小人前进。棍子末端刚好在第二个块上通过，否则失败。
stickHero.prototype.panduan = function(){
	//先移除该绑定事件，避免多次执行（棍子的高度和旋转角度都有变化，会执行两次）
	removeEnd(_this.oStick,_this.panduan);
	
	document.getElementById("pao").play();
	_this.oHero.style.transition = "left 1.5s ease-in-out";
	_this.oHero.style.WebkitTransition = "left 1.5s ease-in-out";
	
	_this.oHero.style.backgroundImage = "url(images/hero_go.gif)";
	
	console.log("判断");
	//判断成功或失败
	if(_this.oStick.offsetHeight > _this.oMiddle.offsetLeft-_this.oLeft.offsetWidth && _this.oStick.offsetHeight < _this.oMiddle.offsetLeft-_this.oLeft.offsetWidth+_this.oMiddle.offsetWidth){
		_this.oHero.style.left = _this.oMiddle.offsetLeft + _this.oMiddle.offsetWidth -_this.oHero.offsetWidth+"px";
		_this.step++;
		_this.score++;
		
		addEnd(_this.oHero,_this.success);
	}else{
		_this.oHero.style.left = _this.oHero.offsetLeft + _this.oStick.offsetHeight+"px";
		addEnd(_this.oHero,_this.erro);
	}
}
	
//成功通过函数
stickHero.prototype.success = function (ev){
	console.log("成功！");
	_this.runing = false;
	document.getElementById("jinbi").play();
	_this.oScore.innerHTML = _this.score;
	_this.oHero.style.backgroundImage = "url(images/hero.gif)";
	
	//画布整体往左移
	_this.oCon.style.left = -_this.oMiddle.offsetLeft+"px";
	_this.oCon.style.transition = "1s linear";
	_this.oCon.style.WebkitTransition = "1s linear";
	
	//同时背景图片也往左移
	_this.oBox.style.backgroundPosition = -_this.step*50+"px top";
	_this.oBox.style.transition = "1s linear";
	_this.oBox.style.WebkitTransition = "1s linear";
	
	addEnd(_this.oCon,_this.reset);
	ev.stopPropagation();	//阻止冒泡
}

//场景重置
stickHero.prototype.reset = function(){
	console.log("重置");
	console.log(_this.runing);
	//取消之前绑定的效果
	removeEnd(_this.oStick,_this.panduan);
	removeEnd(_this.oHero,_this.success);
	removeEnd(_this.oCon,_this.reset);

	_this.oCon.style.transition = "none";
	_this.oCon.style.WebkitTransition = "none";
	_this.oCon.style.left = 0;
	
	_this.oLeft.style.width = _this.oMiddle.offsetWidth+"px";
	_this.oMiddle.style.width = _this.oRight.offsetWidth+"px";
	_this.oMiddle.style.left = _this.oRight.offsetLeft - _this.oMiddle.offsetLeft+"px";
	
	_this.oHero.style.transition = "none";
	_this.oHero.style.WebkitTransition = "none";
	_this.oHero.style.left = _this.oLeft.offsetWidth-_this.oHero.offsetWidth+"px";
	
	//复位棍子
	_this.oStick.style.transition = "none";
	_this.oStick.style.WebkitTransition = "none";
	_this.oStick.style.height = 0;
	_this.oStick.style.transform = "Rotate(0deg)";
	_this.oStick.style.WebkitTransform = "Rotate(0deg)";
	_this.oStick.style.left = _this.oLeft.offsetWidth-_this.oStick.offsetWidth+"px";
	
	//生成第三个块（备用）
	_this.createRight(_this.oMiddle,30,200);
}

//未通过函数
stickHero.prototype.erro = function(){
	console.log("失败！");
	//设置人物和棍子掉下效果
	_this.oStick.style.transition = "0.3s ease-in";
	_this.oStick.style.WebkitTransition = "0.3s ease-in";
	_this.oHero.style.transition = "0.3s ease-in";
	_this.oHero.style.WebkitTransition = "0.3s ease-in";
	_this.oStick.style.transform = "Rotate(180deg)";	
	_this.oStick.style.WebkitTransform = "Rotate(180deg)";
	_this.oHero.style.bottom = -_this.oHero.offsetHeight+"px";
	
	//取消之前绑定的效果
	removeEnd(_this.oStick,_this.panduan);
	removeEnd(_this.oHero,_this.erro);
	
	setTimeout(function(){
		document.getElementById("luoshui").play();
	},100);
	
	setTimeout(function(){
		_this.oGameover.style.display = "block";
		_this.oGameover.style.height = _this.H+"px";
		_this.oGameover.style.zIndex = _this.zindex;
		_this.oScore.style.display = "none";
		document.getElementById("result1").innerHTML = _this.score;
		
		_this.gamesover();
		//alert("对不起，闯关失败。已闯过"+score+"关");
	},500);
	
}

//生成第三个块数据函数
stickHero.prototype.createRight = function (middle,mixw,maxw){
	maxw = maxw > middle.offsetLeft ? middle.offsetLeft : maxw;
	var rwidth = _this.getRanWidth(middle,mixw,maxw);
	var rleft = getRandom(_this.boxW,_this.boxW-rwidth+middle.offsetLeft);
	
	//console.log("boxW:"+boxW+";rwidth:"+rwidth+";middle.offsetLeft:"+middle.offsetLeft+";rleft:"+rleft);
	
	_this.oRight.style.width = rwidth+"px";
	_this.oRight.style.left = rleft+"px";
}

//随机生成块的宽
stickHero.prototype.getRanWidth = function(before,mixw,maxw){
	Maxwidth = (_this.boxW-before.offsetWidth)>maxw? maxw : _this.boxW-before.offsetWidth;		
	return getRandom(mixw,Maxwidth);
}

//游戏结束后的操作
stickHero.prototype.gamesover = function(){
	//分享
	var oShare = document.getElementById("share");
	var oShareDiv = document.getElementById("share_div");
	oShare.onclick = function(){
		oShareDiv.style.display = "block";
		oShareDiv.style.height = _this.H+"px";
		oShareDiv.style.zIndex = _this.zindex;
	}
	oShareDiv.onclick = function(){
		this.style.display = "none";
	}
	
	//关注
	var oStar = document.getElementById("star");
	var oWeixin = document.getElementById("weixin");
	var oWeixinClose = document.getElementById("weixin_close");
	
	oStar.onclick = function(){
		oWeixin.style.display = "block";
		oWeixin.style.zIndex = _this.zindex;
	}
	oWeixinClose.onclick = function(){
		oWeixin.style.display = "none";
	}
	
	var reset = document.getElementById("reset");
	reset.onclick = function(){
		_this.oGameover.style.display = "none";
		_this.oScore.style.display = "block";
		_this.oBox.style.transition = "none";
		_this.oBox.style.backgroundPosition = "left top";
		_this.score = 0;
		_this.step = 0;
		_this.oScore.innerHTML = _this.score;
		_this.init();
	}
}

//绑定过渡完成函数
function addEnd(obj,fn){
	obj.addEventListener('WebkitTransitionEnd',fn,false);
	obj.addEventListener('transitionend',fn,false);
}
//取消绑定过渡完成函数
function removeEnd(obj,fn){
	obj.removeEventListener('WebkitTransitionEnd',fn,false);
	obj.removeEventListener('transitionend',fn,false);
}

//随机数
function getRandom(min,max){
	if(min > max){
		return min;
	}else{
		return Math.round(Math.random()*(max-min))+min;
	}
}