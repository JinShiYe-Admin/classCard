 //此js用于保存本地存储时，用到的key值

var storageKeyName = (function(mod) {

	mod.key = 0; //0,开发;1,部署外网
	// var exLog = console.log;
	// console.log = function(hint, object) {
	// 	if(mod.key === 1) {
	// 		var argus = hint;
	// 		if(typeof(object) !== 'undefined') {
	// 			argus = hint + JSON.stringify(object);
	// 		}
	// 		exLog.apply(this, [argus]);
	// 	}
	// }
	switch(mod.key) {
		case 0: //开发
			mod.PLATFORMCODE = 'PT0002'; //平台代码
			mod.APPCODE = 'schapp#'; //应用系统代码
			mod.INTERFACE_SSO_SKIN = 'http://develop309.jiaobaowang.net/ssotoskin/api/skin/'; //顾工接口
			mod.INTERFACE_BANPAI = 'http://develop309.jiaobaowang.net:8081/bullboard/sub/'; //孔
			break;
		case 1: //部署外网
			mod.PLATFORMCODE = 'PT0002'; //平台代码
			mod.APPCODE = 'schapp#'; //应用系统代码
			mod.INTERFACE_SSO_SKIN = 'http://develop309.jiaobaowang.net/ssotoskin/api/skin/'; //顾工接口
			mod.INTERFACE_BANPAI = 'http://develop309.jiaobaowang.net:8081/bullboard/sub/'; //孔
			break;
		case 2: //测试
			mod.PLATFORMCODE = 'PT0002'; //平台代码
			mod.APPCODE = 'schapp#'; //应用系统代码
			mod.INTERFACE_SSO_SKIN = 'http://develop309.jiaobaowang.net/ssotoskin/api/skin/'; //顾工接口
			mod.INTERFACE_BANPAI = 'http://develop309.jiaobaowang.net:8081/bullboard/sub/'; //孔
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