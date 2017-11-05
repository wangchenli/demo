var top2 = document.getElementById('top2');
var aSpan = top2.getElementsByTagName('span');
var btn = document.getElementById('btn');
var arr = ['极差','一般','不错','推荐','力荐'];
var arrBg = ['url(images/star1.png)','url(images/star2.png)'];
var n = -1;
for(var i=0;i<aSpan.length;i++){
	aSpan[i].index = i;
	aSpan[i].onmouseover = function(){
		btn.style.display = 'block';
		btn.value = arr[this.index];
		for(var j=0;j<aSpan.length;j++){
			aSpan[j].style.background = '';
		}
		if(this.index<2){
			for(var j=0;j<=this.index;j++){
				aSpan[j].style.background = arrBg[0];
			}
		}else if(this.index>=2){
			for(var j=0;j<=this.index;j++){
				aSpan[j].style.background = arrBg[1];
			}
		}
	}
	aSpan[i].onmouseout = function(){
		btn.value = arr[this.index];
		
		for(var j=0;j<aSpan.length;j++){
			aSpan[j].style.background = '';
		}
		for(var i=0;i<=n;i++){
			if(n<2){
				aSpan[i].style.background = arrBg[0];
			}else{
				aSpan[i].style.background = arrBg[1];
			}
		}
		
	}
	aSpan[i].onclick = function(){
		n = this.index;
	}
}




