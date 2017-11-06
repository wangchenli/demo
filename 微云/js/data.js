var data = {
    "0": {
        "id": 0,
        "pid": -1,
        "title": "微云",
        "type": "file"
    },
    "1": {
        "id": 1,
        "pid": 0,
        "title": "我的文档",
        "type": "file"
    },
    "2": {
        "id": 2,
        "pid": 0,
        "title": "我的音乐"
    },
    "3": {
        "id": 3,
        "pid": 2,
        "title": "周杰伦"
    },
    "4": {
        "id": 4,
        "pid": 3,
        "title": "发如雪"
    },
    "600": {
        "id": 600,
        "pid": 3,
        "title": "夜曲"
    },
    "2999": {
        "id": 2999,
        "pid": 1,
        "title": "js程序设计"
    },
    "4000": {
        "id": 4000,
        "pid": 3,
        "title": "稻香"
    },
    "23333": {
        "id": 23333,
        "pid": 2,
        "title": "王杰"
    },
    "29000": {
        "id": 29000,
        "pid": 1,
        "title": "js权威指南"
    },
    "244444": {
        "id": 244444,
        "pid": 2,
        "title": "张国荣"
    }
}
//var arr1 = [];
//var id = 3;
//function getParentById(id){
//	var item = data[id];
//	for(var attr in data){
//		if(data[attr].id == item.pid){
//			return data[attr]
//		}
//	}
//
//	return null;
//}
//
//
//
//while(data[id]){
//	arr1.push(data[id])
//	data[id] = getParentById(data[id].id);
//	
//}
//console.log(arr1)


//function getChildById(id){
//	var item = data[id];
//	if(item){
//		return item
//	}
//	return null;
//}
//function getPerentById(id){
//	var item = getChildById(id);
//	for(var attr in data){
//		if(data[attr].id === item.pid){
//			return false;
//		}
//	}
//}
