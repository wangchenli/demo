var dateTime = $('.date_time')[0];
var curMonth = $('.cur-month')[0];
var curMonth2 = $('.cur-month2')[0];
var dateNums = $('.date-nums')[0];
var dateDays = $('.date-days')[0];
var next = $('.next')[0];
var prev = $('.prev')[0];
var box = $('.box')[0];
var n = 0;

setInterval(function(){
	dateTime.innerHTML = getTime()
},1000)
function getTime(){
	var now = new Date();
	var hours = now.getHours();
	var minutes = now.getMinutes();
	var seconds = now.getSeconds();
	return addZero(hours)+':'+addZero(minutes)+':'+addZero(seconds);
}
render(n)
function render(n){
	// 设置一个固定不变的月 真实的月 已当前这个月为起始点，向前或向后推进
	var now = new Date();
	var years = now.getFullYear();
	var months = now.getMonth()+1; // 此时此刻的月
	var dates = now.getDate();
	curMonth.innerHTML = years+'年'+addZero(months)+'月'+addZero(dates)+'日';
	
	// 改变为最新的日期
	var newDate = new Date();
	newDate.setMonth(now.getMonth()+n)
	var newYears = newDate.getFullYear();
	var newMonths = newDate.getMonth()+1; 
	var newDates = newDate.getDate();
	curMonth2.innerHTML = newYears+'年'+addZero(newMonths)+'月';
	
	var d1 = new Date();
	d1.setMonth(newDate.getMonth()+1);
	d1.setDate(0);
	var totledays = d1.getDate();  //这个月有多少天
	
	var d2 = new Date();
	d2.setMonth(newDate.getMonth())
	d2.setDate(1);
	var firstDay = d2.getDay(); //1号是周几
	if(firstDay == 0)firstDay = 7;
	
	//上个月有多少天
	var d3 = new Date(); 
	d3.setMonth(newDate.getMonth());
	d3.setDate(0);
	var prevTotleDays = d3.getDate();
	
	var nextTotleDays = 42-totledays-firstDay+1;
	
	var html = '';
	for(var i = 0; i < firstDay-1; i++){
		html = `<span style="color:#868685;">${prevTotleDays-i}</span>`+html
	}
	for(var i = 1; i <= totledays; i++){
		if(i === dates && newMonths === months){
			html += `<span class="light">${i}</span>`
		}else{
			html += `<span>${i}</span>`
		}
	}
	for(var i = 1; i <= nextTotleDays; i++){
		html += `<span style="color:#868685;">${i}</span>`
	}
	dateNums.innerHTML = html;
}

next.onclick = function(){
	n++;
	render(n)
}
prev.onclick = function(){
	n--;
	render(n)
}
//span1移入移出添加的背景；
var spans1 = $('.date-nums span');
var prevIndex = 0;
for(var i=0;i<spans1.length;i++){
	spans1[i].index = i;
	spans1[i].onmouseover = function(){
		spans1[prevIndex].className = '';
		this.className = 'light';
		prevIndex = this.index;
	}
	spans1[i].onmouseout = function(){
		this.className = '';
	}
}

//隐藏的月份里自动生成的span （16个)
var hiddenDate = $('.hidden_date')[0];
var html1 = '';
for(var i = 1 ;i <= 12; i++){
	html1 += `<span>${i}月</span>`
}
for(var i = 1 ;i <= 4; i++){
	html1 += `<span style="color:#868685;">${i}月</span>`
}
hiddenDate.innerHTML = html1;

//隐藏的月份里自动生成的每个span都有点击事件
curMonth2.onclick = function(){
	curMonth2.innerHTML = new Date().getFullYear()
	dateNums.style.display = 'none';
	dateDays.style.display = 'none';
	mTween(box,{
		width: 337,
		height: 284
	},500,'linear',function(){
		hiddenDate.style.display = 'block';
	})
	
}

var spans2 = $('span',hiddenDate);
for(var i=0;i<spans2.length;i++){
	spans2[i].index = i;
	spans2[i].onclick = function(){
		for(var i=0;i<spans2.length;i++){
			spans2[i].className = '';
		}
		var thisMonth = parseInt(new Date().getMonth()+1);
		
		thisMonth = this.index;
		spans2[thisMonth].className = 'blue';
		this.className = 'blue';
		hiddenDate.style.display = 'none';
		dateNums.style.display = 'block';
		dateDays.style.display = 'block';
		render(this.index)
		if(this.index < 12){
			curMonth2.innerHTML = new Date().getFullYear()+'年'+(this.index+1)+'月';
		}else{
			curMonth2.innerHTML = (new Date().getFullYear()+1)+'年'+(this.index-12+1)+'月';
		}
		
	}
}
