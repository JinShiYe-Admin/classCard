﻿ //此js用于保存本地存储时，用到的key值

var storageKeyName = (function(mod) {

	mod.key = 0; //0,开发;1,部署外网
	var exLog = console.log;
	console.log = function(hint, object) {
		if(mod.key === 0) {
			var argus = hint;
			if(typeof(object) !== 'undefined') {
				argus = hint + JSON.stringify(object);
			}
			exLog.apply(this, [argus]);
		}
	}
	switch(mod.key) {
		case 0: //开发
			mod.SCHOOLID = 100005; //学校ID
			mod.USERTYPE = 0; //用户类型，0老师,1家长,2学生
			mod.INTERFACEGU = 'https://jsypay.jiaobaowang.net/useradminwebapi/api/data/'; //顾工接口
			break;
		case 1: //部署外网
			mod.SCHOOLID = 100005; //学校ID
			mod.USERTYPE = 0; //用户类型，0老师,1家长,2学生
			mod.INTERFACEGU = 'https://zhxy.jiaobaowang.net:8515/schadminwebapi/api/data/'; //顾工接口
			break;
		default:
			break;
	}
	mod.PERSONALINFO = 'personalInfo1111'; //个人信息，登录成功后返回值
	mod.SHAKEHAND = 'ShakeHand'; //公钥，登录时，返回的握手信息，
	mod.PUBLICPARAMETER = 'publicParameter' //共用参数
	

	mod.WAITING = '加载中...'; //
	mod.UPLOADING = '上传中...';
	mod.SIGNKEY = 'jsy309'; //签名密钥

	return mod;

})(storageKeyName || {});