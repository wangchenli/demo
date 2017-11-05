// 给数据，返回html结构
function createHtml(data){
	var html = data.map(function(item){
		return `
			<div class="box">
				<div class="header">
					<input class="time" value="2016 11 29 19:41:00">
					<span class="btn">确定</span>
				</div>
				<div class="content">
			
					<div class="countdown">
						<span class="text">剩余</span>
						<span class="number">0</span>
						<span class="number">0</span>
						<span class="point">:</span>
						<span class="number">0</span>
						<span class="number">9</span>
						<span class="point">:</span>
						<span class="number">4</span>
						<span class="number">0</span>
					</div>
			
					<a href="javascript:;" class="thumbnail">
						<img src="${item.imgUrl}">
					</a>
			
					<p class="name">${item.title}</p>
					<p class="price-text">
						抢购价：
						<span class="price">￥${item.price}</span>
					</p>
			
				</div>
				<div class="mask"></div>
				<div class="sold-out-img"></div>
			</div>
		`
	}).join('')
	return html;
}