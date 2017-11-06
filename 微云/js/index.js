(function(){
	
	//自适应宽高
	var section = document.querySelector('#section');
	var head = document.querySelector('#head');
	function resize(){
		var clientH = document.documentElement.clientHeight;
		section.style.height = clientH - head.offsetHeight+'px';
	}
	window.onresize = resize;
	resize();

	var level = -1;
	var initId = -1;
	//-------------------------得到子元素---------------------------
	function getChildsById(id){
		var arr = [];
		for(var attr in data){
			if(data[attr].pid == id){
				arr.push(data[attr])
			}
		}
		return arr;
	}
	//--------------------生成左边的数据菜单-----------------------
	function creatHTML(id,level){
		var arr = getChildsById(id);
		level++;
		var treeHtml = '';
		if(arr.length){
			treeHtml += '<ul>';
			arr.forEach(function(item){
				html = creatHTML(item.id,level)
				treeHtml += `<li>
							<div data-id="${item.id}" style="padding-left:${level*15}px;" class="tree-title ${html !== '' ? 'tree-ico' : '' } close">
								<span><i></i>${item.title}</span>
							</div>`
				treeHtml += html;
				treeHtml += `</li>`;
			})
			treeHtml += '</ul>';			
		}
		return treeHtml
	}
	var treeMenu = document.querySelector('.tree-menu');
	treeMenu.innerHTML = creatHTML(initId,level);
	
	
	//-----------------定位到指定的元素-------------------------
	function positionElement(positionId){
		var treeDivs = $('div',treeMenu);
		for(var i=0;i<treeDivs.length;i++){
			
			if(treeDivs[i].dataset.id == positionId){
				treeDivs[i].classList.add('active');
				continue;
			}
			treeDivs[i].classList.remove('active');
		}
	}
	positionElement(0)
	
	//--------------------生成文件------------------------
	var fEmpty = $('.f-empty')[0];
	function creatfileHtml(id,state){
		var childs = getChildsById(id)
		if(childs.length){
			var fileHtml = childs.map(function(item){
				return `
					<div data-id="${item.id}" class="file-item">
						<img src="img/folder-b.png" alt="" />
						<span data-id="${item.id}" class="folder-name">${item.title}</span>
						<input type="text" class="editor"/>
						<i data- class="${state==true ? "checked": ''}"></i>
					</div>
				`
			}).join('');
			fEmpty.style.display = 'none';
			return fileHtml;
		}else{
		 	return fEmpty.style.display = 'block';
		}
		
	}
	var folders = $('.folders')[0];
	folders.innerHTML = creatfileHtml(0);
	
	
	
	//---------------------导航条结构--------------------------
	
	function getParentsId(id){
		var arr = [];
		for(var attr in data){
			if(data[attr].id == id){
				arr.push(data[attr])
				arr = arr.concat(getParentsId(data[attr].pid))
				break
			}			
		}
		return arr;
	}
	function creatNavHtml(id){
		var parents = getParentsId(id).reverse();
		var breadNavHtml = '';
		for(var i=0;i<parents.length-1;i++){
			breadNavHtml += `<a data-id="${parents[i].id}" href="javascript:;">${parents[i].title}</a>`;
		}
		breadNavHtml += `<span data-id="${parents[parents.length-1].id}">${parents[parents.length-1].title}</span>`;
		return breadNavHtml;
	}
	var breadNav = $('.bread-nav')[0];
	breadNav.innerHTML = creatNavHtml(0);
	
	//------------------跳转到别的页面时清除全选的勾选-----------------------
	var childsNum = breadNav.children.length;
	function delCheckedAll(){
		var span = $('.bread-nav span')[0];	
		var spanId = span.dataset.id;
		var spanChildNum = getChildsById(spanId).length;
		state = false;
		if(childsNum !== spanChildNum){
			checkedAll.classList.remove('checked');	
		}
	}
	
	
	//------------------------------------------
	
	var treeDivs = $('div',treeMenu);
	for(var i=0;i<treeDivs.length;i++){
		treeDivs[i].onclick = function(){		
			var treeId = this.dataset.id;		
			folders.innerHTML = creatfileHtml(treeId);
			breadNav.innerHTML = creatNavHtml(treeId);
			positionElement(treeId)
			delCheckedAll()
			
		}
	}
	
	
	var breadNav = $('.bread-nav')[0];
	breadNav.onclick = function(ev){
		if(ev.target.nodeName == 'A'){
			var treeId = ev.target.dataset.id;		
			folders.innerHTML = creatfileHtml(treeId);
			breadNav.innerHTML = creatNavHtml(treeId);
			positionElement(treeId)
			delCheckedAll()
		}
	}
	
	var folders = $('.folders')[0];
	folders.onclick = function(ev){
		if(ev.target == this){
			return;
		}
		if(ev.target.nodeName == 'DIV'){
			var treeId = ev.target.dataset.id;		
			folders.innerHTML = creatfileHtml(treeId);
			breadNav.innerHTML = creatNavHtml(treeId);
			positionElement(treeId);
			delCheckedAll()
		}else if(ev.target.parentNode.nodeName == 'DIV' && ev.target.nodeName != 'I' && ev.target.nodeName != 'SPAN' && ev.target.nodeName != 'INPUT' ){
			var treeId = ev.target.parentNode.dataset.id;		
			folders.innerHTML = creatfileHtml(treeId);
			breadNav.innerHTML = creatNavHtml(treeId);
			positionElement(treeId);
			delCheckedAll()
		}
		if(ev.target.nodeName == 'I'){
			if(state){
				ev.target.classList.remove('checked')
				ev.target.parentNode.classList.remove('active')
				state = false;
			}else{
				ev.target.classList.add('checked')
				ev.target.parentNode.classList.add('active')			
				state = true;
			}
			allDivSelect()
		}
		if(ev.target.nodeName == 'SPAN'){
			var target = ev.target;
			var thisId = target.dataset.id;
			var editor = target.nextElementSibling;
			editor.style.display = 'block';
			editor.focus()
			
			document.onkeydown = function(ev){
				if(ev.keyCode === 13){
					target.innerHTML = editor.value;
					for(var attr in data){
						if(data[attr].id == thisId){
							console.log(data[attr].id)
							data[attr].title = editor.value;
							treeMenu.innerHTML = creatHTML(initId,level);
							editor.style.display = 'none';
						}
						
					}
					
				}
			}
			
			document.onclick = function(){
				
			}
			
		}
	}
	
	function allDivSelect(){ //判断div有没有都被勾选
		var span = $('.bread-nav span')[0];	
		var spanId = span.dataset.id;
		var spanChildNum = getChildsById(spanId).length;
		var checkedAll = $('.checkedAll')[0];
		var is = $('i',folders);
		if(whoSelect().length === spanChildNum){
			checkedAll.classList.add('checked')
			state = true;
		}else{
			checkedAll.classList.remove('checked')
			state = false;
		}
		
		function whoSelect(){
			var selectArr = [];
			for(var i=0;i<is.length;i++){
				if(is[i].className == 'checked'){
					selectArr.push(is[i]) //选中的input的祖宗添加在数组中
				}
			}
			return selectArr;
		}
	}
	
	
	
	var state = false;
	var checkedAll = $('.checkedAll')[0];
	checkedAll.onclick = function(){
		var span = $('.bread-nav span')[0];	
		var spanId = span.dataset.id;
		
		var spanChildNum = getChildsById(spanId).length;
		var divs = $('.file-item');
		
		if(spanChildNum === 0){
			this.classList.remove('checked');
			return;
		}
		if(state){
			this.classList.remove('checked')
			folders.innerHTML = creatfileHtml(spanId,false);
			for(var i = 0;i<divs.length;i++){
				divs[i].classList.remove('active');
			}
			state = false;
		}else{
			this.classList.add('checked')
			folders.innerHTML = creatfileHtml(spanId,true);
			for(var i = 0;i<divs.length;i++){
				divs[i].classList.add('active');
			}
			state = true;
		}
	}
	
	
	/*folders.onmousedown  = function (ev){
		if(ev.target === this){
			var span = $('.bread-nav span')[0];	
			var spanId = span.dataset.id;
			var spanChildNum = getChildsById(spanId).length;
			var divs = $('.file-item',folders);
			
			var newDiv = document.createElement("div");
			newDiv.className = "box";
			document.body.appendChild(newDiv);
	
			var disX = ev.clientX;
			var disY = ev.clientY;
	
			newDiv.style.left = disX + 'px';
			newDiv.style.top = disY + 'px';
	
			document.onmousemove  =function (ev){
				newDiv.style.width = Math.abs(ev.clientX - disX) + 'px';
				newDiv.style.height = Math.abs(ev.clientY - disY) + 'px';
				newDiv.style.left = Math.min(disX,ev.clientX) + 'px';	
				newDiv.style.top = Math.min(disY,ev.clientY) + 'px';
			};
			document.onmouseup = function (ev){
				document.onmousemove = null;
				var is = $('i',folders);
				for( var i = 0; i < divs.length; i++ ){
					if(collision(newDiv,divs[i])){
						is[i].classList.add('checked')
						state = true;
						divs[i].classList.add('active');
						allDivSelect()
					}else{
						is[i].classList.remove('checked')
						state = false;
						divs[i].classList.remove('active');
						checkedAll.classList.remove('checked');
						state = false;
					}
				}
				newDiv.remove();	
			}
			ev.preventDefault();
		}

	};*/
	
	
})();



