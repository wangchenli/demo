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
								<span data-id="${item.id}"><i></i>${item.title}</span>
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
	
	//--------------------生成右边区域的文件夹------------------------
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
						<i data-check="false" class="${state==true ? "checked": ''}"></i>
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
	
	
	/*-----------------------------------通过指定Id渲染导航栏-------------------------------*/
	
	function getParentsId(id){//通过指定Id找到它父级的父级的父级直到找到微云结束；
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
		isstate = false;
		if(childsNum !== spanChildNum){
			checkedAll.classList.remove('checked');	
		}
	}
	
	
	/*----------------------------------树形菜单点击交互-------------------------------------*/
	
	//var treeDivs = $('div',treeMenu);
	leftActive()
	function leftActive(){
		treeMenu.onclick = function(ev){
			if(ev.target.nodeName === 'SPAN' || ev.target.nodeName === 'DIV'){
				var treeId = ev.target.dataset.id;	
				folders.innerHTML = creatfileHtml(treeId);
				breadNav.innerHTML = creatNavHtml(treeId);
				positionElement(treeId)
				delCheckedAll()
			}
		}
	}
	
	/*---------------------------------给导航（工具栏）添加交互----------------------------------------*/
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
	/*--------------------------------右侧文件夹区域点击事件---------------------------------------*/
	var folders = $('.folders')[0];
	folders.onclick = function(ev){
		var targets = ev.target;
		if(targets == this){
			return;
		}
		if(targets.nodeName == 'DIV'){
			var treeId = targets.dataset.id;		
			folders.innerHTML = creatfileHtml(treeId);
			breadNav.innerHTML = creatNavHtml(treeId);
			positionElement(treeId);
			delCheckedAll()
		}else if(targets.parentNode.nodeName == 'DIV' && targets.nodeName != 'I' && targets.nodeName != 'SPAN' && targets.nodeName != 'INPUT' ){
			var treeId = targets.parentNode.dataset.id;		
			folders.innerHTML = creatfileHtml(treeId);
			breadNav.innerHTML = creatNavHtml(treeId);
			positionElement(treeId);
			delCheckedAll()
		}
		if(targets.nodeName == 'I'){
			if(targets.dataset.check === 'true'){
				
				targets.classList.remove('checked')
				targets.parentNode.classList.remove('active')
				targets.dataset.check = 'false';
				isstate = false;
			}else{
				targets.classList.add('checked')
				targets.parentNode.classList.add('active')			
				targets.dataset.check = 'true';
				isstate = true;
			}
			allDivSelect()
			
		}
		if(targets.nodeName == 'SPAN'){			
			var thisId = targets.dataset.id;
			var editor = targets.nextElementSibling;
			editor.style.display = 'block';
			editor.focus()
			function renderName(){
				targets.innerHTML = editor.value;
				for(var attr in data){
					if(data[attr].id == thisId){
						data[attr].title = editor.value;
						treeMenu.innerHTML = creatHTML(initId,level);
						editor.style.display = 'none';
						break;
					}
					
				}
			}
//			document.onkeydown = function(ev){
//				if(ev.keyCode === 13){
//					renderName()
//				}
//			}
//			document.onclick = function(){
//				if(!editor.value){
//					editor.value = targets.innerHTML;
//				}
//				renderName()
//			}
			
		}
		leftActive()
		isstate = false;
	}
	folders.onmousedown  = function (ev){
		if(ev.target === this){
			var span = $('.bread-nav span')[0];	
			var spanId = span.dataset.id;
			var spanChildNum = getChildsById(spanId).length;
			var divs = $('.file-item',folders);
			var is = $('i',folders);
			checkedAll.classList.remove('checked')
			
			for(var i = 0;i<divs.length;i++){
				divs[i].classList.remove('active');
				is[i].classList.remove('checked')
				is[i].dataset.check = 'false';
			}
			isstate = false;
			var newDiv = document.createElement("div");
			newDiv.className = "box";
			folders.appendChild(newDiv);
			
				
			var disX = ev.clientX - folders.getBoundingClientRect().left;
			var disY = ev.clientY - folders.getBoundingClientRect().top;
			
			
			folders.onmousemove  =function (ev){
				
				newDiv.style.width = Math.abs(ev.clientX - folders.getBoundingClientRect().left -disX) + "px";
				newDiv.style.height = Math.abs(ev.clientY - folders.getBoundingClientRect().top-disY) + "px";
				newDiv.style.left = Math.min(ev.clientX - folders.getBoundingClientRect().left,disX) + "px";
				newDiv.style.top = Math.min(ev.clientY - folders.getBoundingClientRect().top,disY) + "px";
				
				
				for( var i = 0; i < divs.length; i++ ){
					if(collision(newDiv,divs[i])){
						is[i].classList.add('checked')
						is[i].dataset.check = 'true';
						divs[i].classList.add('active');						
					}else{
						is[i].classList.remove('checked')
						is[i].dataset.check = 'false';
						divs[i].classList.remove('active');
					}
					
				}
			};
			document.onmouseup = function (ev){
				allDivSelect()
				folders.onmousemove = null;
				newDiv.remove();	
			}
			ev.preventDefault();
			isstate = false;
		}

	};
	
	
	//-------------------判断所有的i是否都被勾选；全部勾选了全选就是选中状态；------------------------
	function allDivSelect(){
		var span = $('.bread-nav span')[0];	
		var spanId = span.dataset.id;
		var spanChildNum = getChildsById(spanId).length;
		var checkedAll = $('.checkedAll')[0];
		var is = $('i',folders);
		if(whoSelect().length === spanChildNum){
			checkedAll.classList.add('checked')
			isstate = true;
		}else{
			checkedAll.classList.remove('checked')
			isstate = false;
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
	
	/*--------------------------------全选按钮的点击事件---------------------------------------------*/
	var isstate = false;
	var checkedAll = $('.checkedAll')[0];
	checkedAll.onclick = function(){
		console.log(isstate)
		var span = $('.bread-nav span')[0];	
		var spanId = span.dataset.id;
		var spanChildNum = getChildsById(spanId).length;
		var divs = $('.file-item');
		var is = $('i',folders);
		if(spanChildNum === 0){
			this.classList.remove('checked');
			return;
		}
		if(isstate){
			this.classList.remove('checked')
			
			for(var i = 0;i<divs.length;i++){
				divs[i].classList.remove('active');
				is[i].classList.remove('checked')
				is[i].dataset.check = 'false';
			}
			isstate = false;
		}else{
			this.classList.add('checked')
			for(var i = 0;i<divs.length;i++){
				divs[i].classList.add('active');
				is[i].classList.add('checked')
				is[i].dataset.check = 'true';
			}
			isstate = true;
		}
	}
	
	
	/*--------------------------------新建文件夹的点击事件---------------------------------------------*/
	var create = $('#create');
	create.addEventListener('click',function(){
		var span = $('.bread-nav span')[0];	
		var spanId = span.dataset.id;
		
		var num = Date.now();
		data[num] = {
			"id": num,
	        "pid": spanId,
	        "title": "",
	        "type": "file"
		}
		folders.innerHTML = creatfileHtml(spanId)
		var editor = folders.lastElementChild.querySelector('.editor');
		var folderName = editor.previousElementSibling;
		editor.style.display = 'block';
		editor.focus()
		document.addEventListener('mousedown',function(){
			folderName.innerHTML = editor.value;
			leftActive()
			if(!folderName.innerHTML){
				return;
			}
			data[num].title = folderName.innerHTML;
			treeMenu.innerHTML = creatHTML(initId,level);		
			editor.style.display = "none";	
			isstate = false;
		})
	})
	
})();



