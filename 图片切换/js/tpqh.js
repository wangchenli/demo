var oBtn1 = document.getElementById('btn1');
var oBtn2 = document.getElementById('btn2');
var oImg = document.getElementById('img');
var oText1 = document.getElementById('text1');
var oText2 = document.getElementById('text2');
var oSpan1 = document.getElementById('span1');
var oPrev = document.getElementById('prev');
var oNext = document.getElementById('next');
var arr = ["images/1.png","images/2.png","images/3.png","images/4.png"];
var arr1 = ["图片1","图片2","图片3","图片4"]
var n = 0;
var mode = 1;   //循环切换；
//var mode = 2;   //顺序切换；


oBtn1.onclick = function(){
	btn2.style.cssText = 'background: #000;color: #fff;'
	btn1.style.cssText = 'background: #fff;color: #000;'
	oText1.innerHTML = '图片可从最后一张跳转到第一张循环切换';
	mode = 1;
	
}
//循环切换；
oNext.onclick = function(){
	oNext.style.cssText = 'background: #000;opacity: 0.6;'
	n++
	if(n>arr.length-1){
		if(mode == 1){
			n = 0;
		}else{
			alert('没有图片了');
			n--; 
		}
	}
	oSpan1.innerHTML = n+1+'/'+arr.length;
	oText2.innerHTML = arr1[n];
	oText2.style.cssText = 'background: #000;opacity: 0.5;'
	img.src = arr[n];
}
oPrev.onclick = function(){
	oPrev.style.cssText = 'background: #000;opacity: 0.6;'
	n--   // n最小是0，如果n小于0的时候，就让n为数组的length-1
	if(n<0){
		if(mode == 1){
			n = arr.length-1;
		}else{
			alert('没有图片了');
			n = 0;
		}
	}
	oSpan1.innerHTML = n+1+'/'+arr.length;
	oText2.innerHTML = arr1[n];
	oText2.style.cssText = 'background: #000;opacity: 0.5;'
	img.src = arr[n]
}
oBtn2.onclick = function(){
	btn1.style.cssText = 'background: #000;color: #fff;'
	btn2.style.cssText = 'background: #fff;color: #000;'
	oText1.innerHTML = '图片只能到最后一张或只能到第一张切换';
	mode = 2;
}

//顺序切换；
//oNext.onclick = function(){
//	oNext.style.cssText = 'background: #000;opacity: 0.6;'
//	n++
//	if(n>arr.length-1){
//		alert('没有图片了')
//		n = arr.length-1;
//	}
//	oSpan1.innerHTML = n+1+'/'+arr.length;
//	oText2.innerHTML = arr1[n];
//	oText2.style.cssText = 'background: #000;opacity: 0.5;'
//	img.src = arr[n];
//}
//oPrev.onclick = function(){
//	oPrev.style.cssText = 'background: #000;opacity: 0.6;'
//	n--
//	if(n<0){
//		alert('没有图片了')
//		n = 0;
//	}
//	oSpan1.innerHTML = n+1+'/'+arr.length;
//	oText2.innerHTML = arr1[n];
//	oText2.style.cssText = 'background: #000;opacity: 0.5;'
//	img.src = arr[n]
//}