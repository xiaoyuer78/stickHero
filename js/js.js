// JavaScript Document
window.onload=function(){
	//实现PC手机都能兼容
	var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
	hasTouch = 'ontouchstart' in window && !isTouchPad;
	touchStart = hasTouch ? 'touchstart' : 'mousedown';
	touchMove = hasTouch ? 'touchmove' : 'mousemove';
	touchEnd = hasTouch ? 'touchend' : 'mouseup';
	
	var oBox = document.getElementById("box");
	var oCon = document.getElementById("content");
	var oScore = document.getElementById("score");
	var oGameover = document.getElementById("gameover");
	
	//计算画布数据
	var boxW = oBox.offsetWidth;
	var conW = boxW*2;
	
	var H = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	
	oCon.style.height = H+"px";
	oBox.style.height = H+"px";	
	
	//场景
	var oLeft = document.getElementById("left");
	var oMiddle = document.getElementById("middle");
	var oRight = document.getElementById("right");
	var oHero = document.getElementById("hero");
	var oStick = document.getElementById("stick");
	
	//生成中间块
	var mwidth = getRanWidth(oLeft,30,200);
	var mleft = getRandom(oLeft.offsetWidth+20,boxW-mwidth);
	oMiddle.style.width = mwidth+"px";
	oMiddle.style.left = mleft+"px";
	
	//生成第三个块（备用）
	createRight(oMiddle,30,200);
	
	oHero.style.left = oLeft.offsetWidth-oHero.offsetWidth+"px";
	oStick.style.left = oLeft.offsetWidth-oStick.offsetWidth+"px";
	
	var step = 0;		//关卡数
	var score = 0;		//分数
	var runing = false;	//是否在运动
	var timer = null;
	document.addEventListener(touchStart, MouseD,false);
	function MouseD(){
		console.log("按下1");
		console.log(runing);
		//如果在运动中，直接返回false
		if(runing){
			return false;
		}
		console.log("按下2");
		clearInterval(timer);
		timer = setInterval(function(){
			oStick.style.height = oStick.offsetHeight+3+"px";
		},10);
		
	}
	//鼠标抬起棍子倒下
	document.addEventListener(touchEnd, MouseU,false);
	function MouseU(){
		//如果小人已掉下，直接返回false
		if(runing){
			return false;
		}
		clearInterval(timer);
		runing = true;
		document.getElementById("jiaoti").play();
		oHero.style.backgroundImage = "url(images/hero_t.gif)";
		//oStick.style.transition = "transform 0.3s linear";
		//oStick.style.WebkitTransition = "transform 0.3s linear" ;
		
		oStick.style.transition = "0.3s linear";
		oStick.style.WebkitTransition = "0.3s linear";
		oStick.style.transform = "Rotate(90deg)";
		oStick.style.WebkitTransform = "Rotate(90deg)";
		addEnd(oStick,panduan);
	}
	//棍子倒下后，小人前进。棍子末端刚好在第二个块上通过，否则失败。
	function panduan(){
		//先移除该绑定事件，避免多次执行（棍子的高度和旋转角度都有变化，会执行两次）
		removeEnd(oStick,panduan);
		
		document.getElementById("pao").play();
		oHero.style.transition = "left 1.5s ease-in-out";
		oHero.style.WebkitTransition = "left 1.5s ease-in-out";
		
		oHero.style.backgroundImage = "url(images/hero_go.gif)";
		
		console.log("判断");
		//判断成功或失败
		if(oStick.offsetHeight > oMiddle.offsetLeft-oLeft.offsetWidth && oStick.offsetHeight < oMiddle.offsetLeft-oLeft.offsetWidth+oMiddle.offsetWidth){
			oHero.style.left = oMiddle.offsetLeft + oMiddle.offsetWidth -oHero.offsetWidth+"px";
			step++;
			score++;
			
			addEnd(oHero,success);
		}else{
			oHero.style.left = oHero.offsetLeft + oStick.offsetHeight+"px";
			addEnd(oHero,erro);
		}
	}
	
	//成功通过函数
	function success(ev){
		console.log("成功！");
		runing = false;
		document.getElementById("jinbi").play();
		oScore.innerHTML = score;
		oHero.style.backgroundImage = "url(images/hero.gif)";
		
		//画布整体往左移
		oCon.style.left = -oMiddle.offsetLeft+"px";
		oCon.style.transition = "1s linear";
		oCon.style.WebkitTransition = "1s linear";
		
		//同时背景图片也往左移
		oBox.style.backgroundPosition = -step*50+"px top";
		oBox.style.transition = "1s linear";
		oBox.style.WebkitTransition = "1s linear";
		
		addEnd(oCon,reset);
		ev.stopPropagation();	//阻止冒泡
		
		//场景重置
		function reset(){
			console.log("重置");
			console.log(runing);
			//取消之前绑定的效果
			removeEnd(oStick,panduan);
			removeEnd(oHero,success);
			removeEnd(oCon,reset);

			oCon.style.transition = "none";
			oCon.style.WebkitTransition = "none";
			oCon.style.left = 0;
			
			oLeft.style.width = oMiddle.offsetWidth+"px";
			oMiddle.style.width = oRight.offsetWidth+"px";
			oMiddle.style.left = oRight.offsetLeft - oMiddle.offsetLeft+"px";
			
			oHero.style.transition = "none";
			oHero.style.WebkitTransition = "none";
			oHero.style.left = oLeft.offsetWidth-oHero.offsetWidth+"px";
			
			//复位棍子
			oStick.style.transition = "none";
			oStick.style.WebkitTransition = "none";
			oStick.style.height = 0;
			oStick.style.transform = "Rotate(0deg)";
			oStick.style.WebkitTransform = "Rotate(0deg)";
			oStick.style.left = oLeft.offsetWidth-oStick.offsetWidth+"px";
			
			//生成第三个块（备用）
			createRight(oMiddle,30,200);
		}
	}
	//未通过函数
	function erro(){
		console.log("失败！");
		//设置人物和棍子掉下效果
		oStick.style.transition = "0.3s ease-in";
		oStick.style.WebkitTransition = "0.3s ease-in";
		oHero.style.transition = "0.3s ease-in";
		oHero.style.WebkitTransition = "0.3s ease-in";
		oStick.style.transform = "Rotate(180deg)";	
		oStick.style.WebkitTransform = "Rotate(180deg)";
		oHero.style.bottom = -oHero.offsetHeight+"px";
		
		//取消之前绑定的效果
		removeEnd(oStick,panduan);
		removeEnd(oHero,erro);
		
		setTimeout(function(){
			document.getElementById("luoshui").play();
		},100);
		
		setTimeout(function(){
			oGameover.style.display = "block";
			oGameover.style.height = H+"px";
			oGameover.style.zIndex = step;
			oScore.style.display = "none";
			document.getElementById("result1").innerHTML = score;
			//alert("对不起，闯关失败。已闯过"+score+"关");
		},500);
		
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
	
	
	//生成第三个块数据函数
	function createRight(middle,mixw,maxw){
		maxw = maxw > middle.offsetLeft ? middle.offsetLeft : maxw;
		var rwidth = getRanWidth(middle,mixw,maxw);
		var rleft = getRandom(boxW,boxW-rwidth+middle.offsetLeft);
		
		//console.log("boxW:"+boxW+";rwidth:"+rwidth+";middle.offsetLeft:"+middle.offsetLeft+";rleft:"+rleft);
		
		oRight.style.width = rwidth+"px";
		
		oRight.style.left = rleft+"px";
	}
	
	//随机生成块的宽
	function getRanWidth(before,mixw,maxw){
		Maxwidth = (boxW-before.offsetWidth)>maxw? maxw : boxW-before.offsetWidth;		
		return getRandom(mixw,Maxwidth);
	}
	
	//随机数
	function getRandom(min,max){
		if(min > max){
			return min;
		}else{
			return Math.round(Math.random()*(max-min))+min;
		}
	}
	
	//其它操作
	
	//分享
	var oShare = document.getElementById("share");
	var oShareDiv = document.getElementById("share_div");
	oShare.onclick = function(){
		oShareDiv.style.display = "block";
		oShareDiv.style.height = H+"px";
		oShareDiv.style.zIndex = step;
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
		oWeixin.style.zIndex = step;
	}
	oWeixinClose.onclick = function(){
		oWeixin.style.display = "none";
	}
}