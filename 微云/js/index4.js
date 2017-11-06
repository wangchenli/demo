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
	/*---------------------操作数据方法---------------------------------*/
	// 通过id获取这个id下的子数据
	function getChildsById(pid){
		var arr = [];
		for( var attr in data){
			if(data[attr].pid == pid){
				arr.push(data[attr])
			}
		}
		return arr;	
	}
	// 通过id找数据
	function getDataById(id){
		var item = data[id];
		if(item){
			return item
		}
		return null;
	}
	// 通过id找这id的父数据

	function getParentById(id){
		var item = getDataById(id);
		for(var attr in data){
			if(data[attr].id == item.pid){
				return data[attr]
			}
		}

		return null;
	}
	// 找到指定id所有的父级
	function getParentsById(id){
		var box = getDataById(id);
		var arr = [];
		while(box){
			arr.push(box);
			box = getParentById(box.id)
		};
		return arr;	
	}
	//判断有没有重复的；
	function reNameState(id,value){
		var childS = getChildsById(id);
		for(var i=0;i<childS.length;i++){
			if(childS[i].title === value){
				return true;
			}
		}
		return false;
	}
	// 找到指定id下所有的子孙数据
	function getChildsAllById(id){
		// 找到这个id的数据
		var item = getDataById(id);
		var arr = [];
		// 把id对对应的数据push到数组中
		arr.push(item);
		for(var attr in data){
			if(data[attr].pid == id){
				arr = arr.concat(getChildsAllById(data[attr].id))
			}
		}

		return arr;
	}
	// 删除指定id下所有的子孙数据
	function delectDataById(id){
		var childsAll = getChildsAllById(id);

		for( var i = 0; i < childsAll.length; i++ ){
			if(data[childsAll[i].id]){
				delete data[childsAll[i].id]
			}
		}
		return false;

	}
	
	
	
	/*---------------------------渲染树形菜单----------------------------*/
	var treeMenu = $('.tree-menu')[0];
	var level = -1;
	var currentId = 0;  // 当前的目录的id为0
	function creatTree(pid,level){
		var arr = getChildsById(pid,level);
		level++;
		var treeHtml = '';
		if(arr.length){
			treeHtml += '<ul>';
			arr.forEach(function(item){
				var childs = creatTree(item.id,level);
				var classNames = childs !== '' ? 'tree-ico' : '';
				treeHtml += `<li>
								<div data-id="${item.id}" style="padding-left:${level*15}px;" class="tree-title ${classNames} close">
									<span data-id="${item.id}"><i></i>${item.title}</span>
								</div>
								${childs}
							 </li>`
			})
			treeHtml += '</ul>';
		}
		return treeHtml;
	}
	treeMenu.innerHTML = creatTree(-1,level);
	
	
	/*----------------------------渲染文件区域----------------------------------*/
	var folders = $('.folders')[0];
	function creatFiles(pid){
		var childs = getChildsById(pid);
		var filesHtml = '';
		if(childs.length){
			childs.forEach(function(item){
				filesHtml +=  `<div data-id="${item.id}" class="file-item">
									<img src="img/folder-b.png" alt="" />
									<span class="folder-name">${item.title}</span>
									<input type="text" class="editor"/>
									<i></i>
								</div>`
			})
		}
		return filesHtml;
	}
	var fEmpty = $('.f-empty')[0];
	var filesHtml = creatFiles(0);
	if(filesHtml === ''){
		fEmpty.style.display = 'block';
	}else{
		fEmpty.style.display = 'none';
		folders.innerHTML = filesHtml;
	}
	
	
	
	/*----------------------------渲染导航区域----------------------------------*/
	
	var breadNav = $('.bread-nav')[0];
	function creatNav(id){
		var parents = getParentsById(id).reverse();
		var navHtml = '';
		if(parents.length){
			for(var i=0;i<parents.length-1;i++){
				navHtml += `<a data-id="${parents[i].id}" href="javascript:;">${parents[i].title}</a>`;
			}
			navHtml += `<span data-id="${parents[i].id}">${parents[i].title}</span>`
		}
		return navHtml;
	}
	breadNav.innerHTML = creatNav(0);
	
	/*-----------------------封装是三个区域交互----------------------------------*/
	function positionId(id){
		var selectDiv = treeMenu.querySelector(`div[data-id="${id}"]`);	
		var divs = treeMenu.getElementsByTagName("div");
		for( var i = 0; i < divs.length; i++ ){
			divs[i].classList.remove('active');
		}
		if(selectDiv){
			selectDiv.classList.add("active");
		}
	}
	function renderTree(treeId){
		var filesHtml = creatFiles(treeId);//渲染树形菜单
		if(filesHtml === ''){
			fEmpty.style.display = 'block';
		}else{
			fEmpty.style.display = 'none';
		}
		folders.innerHTML = filesHtml;
		breadNav.innerHTML = creatNav(treeId);//渲染导航
		positionId(treeId)
		checkedAll.classList.remove('checked');
		currentId = treeId;
	}
	var treeDivs = treeMenu.getElementsByTagName("div");
	positionId(0)
	
	/*----------------树形菜单交互------------------*/
	for(var i=0;i<treeDivs.length;i++){
		on(treeDivs[i],'click',function(){
			var treeId = this.dataset.id;
			renderTree(treeId)
		})
	}
	on(treeMenu,'click',function(ev){
		if(ev.target.nodeName === 'SPAN'){
			var treeId = ev.target.dataset.id;
			renderTree(treeId)
		}
	})
	
	
	
	/*----------------------文件区域的交互------------------------------*/
	var fileItems = folders.getElementsByClassName("file-item");
	var checkBoxs = folders.getElementsByTagName("i");
	on(folders,'click',function(ev){
		
		var target = ev.target;
		if(target.classList.contains('folders')){
			return;
		}
		if(target.nodeName === 'I'){
			return;
		}
		if(target.nodeName === 'INPUT'){
			ev.stopPropagation();
			return;
		}
		if(target.parentNode.classList.contains('file-item')){
			target = target.parentNode;
		}
		var treeId = target.dataset.id;
		renderTree(treeId)
	})
	
	/*----------------------导航区域交互--------------------------*/
	on(breadNav,'click',function(ev){
		if(ev.target.nodeName === 'A'){
			var treeId = ev.target.dataset.id;
			renderTree(treeId)
		}
	})
	
	/*----------------------全选按钮点击事件--------------------------*/
	
	var checkedAll = $('.checkedAll')[0];
	on(checkedAll,'click',function(){
		// 找当前文件下的所有的子数据
		var childs = getChildsById(currentId);
		if(childs.length === 0){
			return;
		}
		
		var xz = this.classList.toggle('checked');
		if(xz){
			for(var i=0;i<checkBoxs.length;i++){
				checkBoxs[i].classList.add('checked');
				fileItems[i].classList.add('hov');
			}
		}else{
			for(var i=0;i<checkBoxs.length;i++){
				checkBoxs[i].classList.remove('checked');
				fileItems[i].classList.remove('hov');
			}
		}
	})
	
	/*---------------------------单选点击-------------------------------------*/
	on(folders,'click',function(ev){
		if(ev.target.nodeName === 'I'){
			ev.target.classList.toggle('checked');
			ev.target.parentNode.classList.toggle('hov');
			if(select().length === 0){
				checkedAll.classList.remove('checked')
				return;
			}
			if(select().length === checkBoxs.length){
				checkedAll.classList.add('checked')
			}else{
				checkedAll.classList.remove('checked')
			}
		}
	})
	
	function select(){//哪些是选中的
		var selsetArr = [];
		for(var i=0;i<checkBoxs.length;i++){
			if(checkBoxs[i].classList.contains('checked')){
				selsetArr.push(checkBoxs[i])
			}
		}
		return selsetArr;
	}

	
	/*-------------------------框选--------------------------------------*/
	on(folders,'mousedown',function(ev){
		var newDiv = document.createElement('div');
		newDiv.className = 'kuang';
		var disX = ev.clientX;
		var disY = ev.clientY;
		newDiv.style.left = disX + 'px';
		newDiv.style.top = disY + 'px';
		newDiv.isAppend = false; // 代表是没有append
		on(document,'mousemove',moveFn);
		on(document,'mouseup',upFn);
		function moveFn(ev){
			if(Math.abs(ev.clientX - disX) > 10 || Math.abs(ev.clientY - disY) > 10){
				if(!newDiv.isAppend){
					document.body.appendChild(newDiv);
					newDiv.isAppend = true;
				}
				newDiv.style.width = Math.abs(ev.clientX - disX) + 'px';
				newDiv.style.height = Math.abs(ev.clientY - disY) + 'px';
				newDiv.style.left = Math.min(ev.clientX,disX) + 'px';
				newDiv.style.top = Math.min(ev.clientY,disY) + 'px';
				for(var i=0;i<fileItems.length;i++){
					if(collision(newDiv,fileItems[i])){
						fileItems[i].classList.add('hov');
						fileItems[i].lastElementChild.classList.add('checked');
					}else{
						fileItems[i].classList.remove('hov');
						fileItems[i].lastElementChild.classList.remove('checked');
					}
				}
				checkedAll.classList.remove("checked");
			}
			
		}
		function upFn(){
			off(document,'mousemove',moveFn);
			off(document,'mouseup',upFn);
			if(newDiv.isAppend){
				document.body.removeChild(newDiv);
			}
			var iS = folders.getElementsByClassName('checked');
			if(iS.length === 0){
				return;
			}
			if(iS.length === fileItems.length){
				checkedAll.classList.add('checked')
			}else{
				checkedAll.classList.remove('checked')
			}
		}
		ev.preventDefault();
	})
	
	/*------------------新建文件夹------------------------------*/
	var create = $('#create');
	var creatTip = $('.full-tip-box')[0];
	var creatTipTxet = $('.tip-text',creatTip)[0];
	on(create,'mouseup',function(){		
		create.isCreate = true;						
		var newFile =  `<div class="file-item hov">
							<img src="img/folder-b.png" alt="" />
							<span style="display:none;" class="folder-name">JS基础课程</span>
							<input style="display:block;" type="text" class="editor"/>
							<i class="checked"></i>
						</div>`
		
		folders.innerHTML = newFile + folders.innerHTML;
		fEmpty.style.display = 'none';
		var firstChild = folders.firstElementChild;
		var editor = firstChild.getElementsByTagName('input')[0];
		editor.focus();
		on(editor,'click',function(ev){
			ev.stopPropagation();
		});
		on(editor,'mousedown',function(ev){
			ev.stopPropagation();
		})
	})
	on(document,'mousedown',function (){
		if(create.isCreate){
			var firstChild = folders.firstElementChild;
			var editor = firstChild.getElementsByTagName('input')[0];
			var val = editor.value.trim();
			var spanName = firstChild.querySelector('span');
			if(val === ''){   //value值为空移除新建文件夹;
				firstChild.remove()  
				var childs = getChildsById(currentId);
				if(childs.length === 0){
					fEmpty.style.display = 'block';
				}
				creatTip.classList.add('err');
				creatTipTxet.innerHTML = '新建文件夹失败';
				creatTipTxet.style.background = 'pink';
				setTimeout(function(){
					creatTip.classList.remove('err');
				},1000)
			}else{
				fEmpty.style.display = 'none';
				if(reNameState(currentId,val)){
					firstChild.remove();
				}else{
					spanName.innerHTML = val;
					editor.style.display = 'none';
					spanName.style.display = 'block';
					var span = $('.bread-nav span')[0];	
					var spanId = span.dataset.id;
					var num = Date.now();
					data[num] = {   //新建的数据添加到data里；
						"id": num,
				        "pid": spanId,
				        "title": val,
				        "type": "file"
					}
					firstChild.setAttribute('data-id',num)   //添加data属性；
					treeMenu.innerHTML = creatTree(-1,level); //重新渲染树形菜单；
					positionId(spanId)
					creatTip.classList.add('err');
					creatTipTxet.innerHTML = '新建文件夹成功';
					creatTipTxet.style.background = 'lightblue';
					setTimeout(function(){
						creatTip.classList.remove('err');
					},1000)
				}
			}
			create.isCreate = false;	
		}		
	})
	
	/*------------------------------删除文件夹-------------------------------------*/
	var del = $('#del');
	var tanbox = $('#tanbox');
	var confBtn = $('.conf-btn')[0];
	var sureA = confBtn.children[0];
	var delA = confBtn.children[1];
	var closeIco = $('.close-ico')[0];
	on(del,'click',function(){
		var span = $('.bread-nav span')[0];	
		var spanId = span.dataset.id;
		var whichSelect = select();
		if(whichSelect.length === 0){
			creatTip.classList.add('err');
			creatTipTxet.innerHTML = '请选中文件删除';
			creatTipTxet.style.background = 'lightblue';
			setTimeout(function(){
				creatTip.classList.remove('err');
			},1000)
		}else{
			tanbox.style.display = 'block';
			on(delA,'click',deletethis);
			on(closeIco,'click',deletethis);			
		}
	})
	on(sureA,'click',function(){	
		var whichSelect = select();
		for(var i=0;i<whichSelect.length;i++){		
			whichSelect[i].parentNode.remove()  //删除结构
			var deleteId = whichSelect[i].parentNode.dataset.id;
			delectDataById(deleteId)  //删除数据	
		}	
		treeMenu.innerHTML = creatTree(-1,level);//渲染结构
		positionId(currentId)  //定位到指定元素
		if(!checkBoxs.length){ 
			fEmpty.style.display = 'block';
			checkedAll.classList.remove('checked');
		} 
		deletethis();
		
	})
	function deletethis(){  //弹框隐藏；
		tanbox.style.display = 'none';
	}
	
	/*------------------------------重命名文件夹-------------------------------------*/
	var rename = $('#rename');
	on(rename,'click',function(){
		
		var span = $('.bread-nav span')[0];	
		var spanId = span.dataset.id;
		var whichSelect = select();	
		if(!whichSelect.length){
			creatTip.classList.add('err');
			creatTipTxet.innerHTML = '请选中文件夹';
			creatTipTxet.style.background = 'lightgreen';
			setTimeout(function(){
				creatTip.classList.remove('err');
			},1000)
		}
		if(whichSelect.length > 1){
			creatTip.classList.add('err');
			creatTipTxet.innerHTML = '不能同时重命名多个文件';
			creatTipTxet.style.background = 'lightgreen';
			setTimeout(function(){
				creatTip.classList.remove('err');
			},1000)
		}
		if(whichSelect.length === 1){
			rename.isRename = true;
			var reNameDiv = whichSelect[0].parentNode;
			var reNameDivId = reNameDiv.dataset.id;
			var reNameSpan = reNameDiv.getElementsByTagName('span')[0];
			var spanInner = reNameSpan.innerHTML;
			var reNameInput = reNameDiv.getElementsByTagName('input')[0];
			reNameSpan.style.display = 'none';
			reNameInput.style.display = 'block';
			reNameInput.value = reNameSpan.innerHTML;
			reNameInput.select();
			if(reNameInput.isOn){
				return;
			}
			reNameInput.isOn = true;
			on(reNameInput,'mousedown',function(ev){
				ev.stopPropagation();
			})
		}
	})
	on(document,'mousedown',function(ev){
		if(rename.isRename){
			var whichSelect = select();	
			var reNameDiv = whichSelect[0].parentNode;
			var reNameDivId = reNameDiv.dataset.id;
			
			var reNameSpan = reNameDiv.getElementsByTagName('span')[0];
			var spanInner = reNameSpan.innerHTML;
			
			var reNameInput = reNameDiv.getElementsByTagName('input')[0];
			var value = reNameInput.value.trim();
			
			reNameSpan.style.display = 'block';
			reNameInput.style.display = 'none';
			if(!value){
				reNameSpan.innerHTML = spanInner;
			}else{
				if(reNameState(currentId,value)){
					creatTip.classList.add('err');
					creatTipTxet.innerHTML = '重命名不成功';
					creatTipTxet.style.background = 'lightgreen';
					setTimeout(function(){
						creatTip.classList.remove('err');
					},1000)
				}else{
					reNameSpan.innerHTML = value;
					data[reNameDivId].title = reNameSpan.innerHTML;
					treeMenu.innerHTML = creatTree(-1,level);
					positionId(currentId)
				}
			}
			
			
			/*
			1. 没选中文件，提醒“请选择要重命名的文件”
			2. 超过选中一个的，提醒“不能同时重命名多个文件”
			3. 当选中一个，才可以重命名
			4. 重名名要然编辑框出现，并且选中编辑中的内容（标题）
			5. 编辑框是空的，还原原来的名字
			6. 编辑不是空的，修改成功 
			*/
			rename.isRename = false;
		}
		
	})
	/*----------------------移动到------------------------------*/
	var remove = $('#remove');
	var dirTree = $('.tree-menu-comm')[0];
	var maskMove = $('.maskMove')[0];
	var closeX = $('.closeX')[0];
	var cancel = $('.cancel')[0];
	var warn = $('.warning')[0];
	on(remove,'click',function(){
		var span = $('.bread-nav span')[0];	
		var spanId = span.dataset.id;
		var whichSelect = select();
		var divs = dirTree.children;
		if(!whichSelect.length){
			creatTip.classList.add('err');
			creatTipTxet.innerHTML = '请选中文件夹';
			creatTipTxet.style.background = 'lightgreen';
			setTimeout(function(){
				creatTip.classList.remove('err');
			},1000)
		}else{
			maskMove.style.display = 'block';
			dirTree.innerHTML = creatTree(-1,level);
			if(dirTree.isOn){
				return;
			}
			dirTree.isOn = true;
			on(dirTree,'click',moveFn);
			on(closeX,'click',closeMaskMove);
			on(cancel,'click',closeMaskMove);
			function moveFn(ev){
				var target = ev.target;
				if(target.nodeName === 'SPAN'){
					var targetId = target.parentNode.dataset.id;  //移动到目标元素的id;
					warn.innerHTML = '';
					var sel = null;
					var arr = [];
					for(var i=0;i<whichSelect.length;i++){
						var moveId = whichSelect[i].parentNode.dataset.id;  //要移动的元素；
						var parentId = getParentById(moveId).id;  //获取父级
						var childsAll = getChildsAllById(moveId); //获取所有的子级；
						sel = whichSelect[i];
						for(var j=0;j<childsAll.length;j++){
							//判断是否是同级和子级，是的话不能移动；
							if(targetId == childsAll[j].id){
								warn.innerHTML = '不能移到同级或子级';
								break;
							}
							arr.push(childsAll[j])
						}
						
						//判断是否是自己的父级，是的话不能移动；
						if(targetId == parentId){
							warn.innerHTML = '不能移到自身父级下面';
							return;
						}
					}
					for(var i=0;i<divs.length;i++){
						divs[i].parentNode.style.background = '';
					}
					target.parentNode.style.background = 'lightblue';
					var confirm = $('.confirm')[0];
					if(confirm.isOn){
						return;
					}
					confirm.isOn = true;
					on(confirm,'click',function(){
						for(var k=0;k<arr.length;k++){
							arr[k].pid = parseInt(targetId);
						}
						sel.parentNode.remove();
						treeMenu.innerHTML = creatTree(-1,level);
						positionId(targetId);							
						creatNav(0);
						var filesHtml = creatFiles(0);
						if(filesHtml === ''){
							fEmpty.style.display = 'block';
						}else{
							fEmpty.style.display = 'none';							
						}
						folders.innerHTML = filesHtml;
						checkedAll.classList.remove('checked');
						closeMaskMove();
					})
					
					
				}
			}
			function closeMaskMove(){
				maskMove.style.display = 'none';
			}
		}
	})
	/*
	1. 没有选择，提醒“请选择要移动的文件”
	2. 选择文件了，出现弹框，弹框的结构和树形菜单是一样
	3. 选择要移动的目标父级
			如果选择的目标父级是选中的要移动的文件自身或子孙级，那么在弹框中提醒（参考原型）
			不是的话，可以移动

			如果移动到目标父级中，和要移动的文件有重名，重名的文件移动不成功，并提示“部分文件移动失败”
 
	*/
	
	
	
	
	
	
	
	
	
	
	
})();
