var top2 = $('#top2');
var spans = $('#top2 span');
var btn = $('#btn');
var arr = ['极差','差劲','一般','很好','极好'];
var arr1 = ['url(images/star1.png)','url(images/star2.png)']
var n = -1;// 用来记录点击元素的小标
var isClick = 0;// 将来用来判断是否点击的标示；默认为0说明没有点击
for(var i=0;i<spans.length;i++){
	spans[i].index = i;
	spans[i].onmouseover = function(){
		btn.style.display = 'block';
		btn.value = arr[this.index];
		func(this.index)
	}
	spans[i].onmouseout = function(){
		if(isClick == 0){
			for(var i=0;i<spans.length;i++){
				spans[i].style.background ='';
				btn.style.display = 'none';
			}
		}else{
			func(n)
			btn.value = arr[n];
		}
	}
	spans[i].onclick = function(){
		isClick = 1;
		n = this.index;
	}
}

// 判断出左边还有右边
// 判断的是每一个元素是在鼠标移入这个元素的左边还是右边
function func(m){
	for(var j=0;j<spans.length;j++){
		if(spans[j].index <= m){
			// stars[j].index 每一个元素的下标
			// this.index 鼠标移入元素的下标
			if(m < 2){
				spans[j].style.background = arr1[0];
			}else{
				spans[j].style.background = arr1[1];
			}
		}else{
			spans[j].style.background ='';
		}
	}
}
