//
document.write('<script src="../../js/lib/RSA/Barrett.js"><\/script>');
document.write('<script src="../../js/lib/RSA/BigInt.js"><\/script>');
document.write('<script src="../../js/lib/RSA/RSA.js"><\/script>');
document.write('<script src="../../js/utils/RSAEncrypt.js"><\/script>');
document.write('<script src="../../js/lib/crypto-js/require.js"><\/script>');
document.write('<script src="../../js/utils/signHmacSHA1.js"><\/script>');
document.write('<script src="../../js/utils/sortSign.js"><\/script>');

function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return(c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
};

//设置头像，如果有，用本身的，没有给默认值
function setImg(imgURL) {
	var tempUrl = '';
	if(imgURL == null || imgURL.length == 0) {
		tempUrl = '../../img/login/headImg.png';
	} else {
		var myDate = new Date();
		tempUrl = imgURL + '?' + myDate.getTime();
	}
	//	console.log('tempUrl000:'+tempUrl);
	return tempUrl;
}

//url,
//encryData,需要加密的字段
//commonData,不需要加密的对象
//flag,0表示不需要合并共用数据，1为添加uuid、utid、token、appid普通参数，2为uuid、appid、token
//callback,返回值
var postDataEncry = function(url, encryData, commonData, flag, callback) {
//	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
//		callback({
//			code: 404,
//			data: null,
//			RspTxt: "网络连接失败,请重新尝试一下"
//		});
//		return;
//	}
	if (flag == 0) {
		// url = window.storageKeyName.INTERFACE_SSO_SKIN + url;
	} else if(flag == 1){
		var personal = store.get(window.storageKeyName.PERSONALINFO);
		var publicPar = store.get(window.storageKeyName.PUBLICPARAMETER);
		// console.log('personalpersonalpersonal:' + JSON.stringify(personal));
		commonData.platform_code = personal.user.platform_code;
		commonData.app_code = personal.user.app_code;
		commonData.unit_code = personal.user.unit_code;
		commonData.index_code = 'index';
		commonData.access_token = personal.access_token;
		// url = window.storageKeyName.INTERFACE_BANPAI + url;
	}
	
	// console.log('url:', url);
	//拼接登录需要的签名
	var signTemp = postDataEncry1(encryData, commonData, flag);
	// console.log('signTemp000:' + signTemp);
	//生成签名，返回值sign则为签名
	signHmacSHA1.sign(signTemp, 'jsy309', function(sign) {
		//组装发送握手协议需要的data
		//合并对象
		var tempData = $.extend(encryData, commonData);
		//添加签名
		tempData.sign = sign;
		// 等待的对话框
		var urlArr = url.split('/');
		// console.log('传递的参数' + url + ':', JSON.stringify(tempData));
		var tempStr = JSON.stringify(tempData).replace(/\\/g, "");
		// console.log('tempStr:' + tempStr);
		jQAjaxPost(url, tempStr, callback);
//		jQAjaxPost(url, JSON.stringify(tempData), callback);
	});
}

//拼接参数
var postDataEncry1 = function(encryData, commonData, flag) {
	//循环
	var tempStr = '';
	for(var tempData in encryData) {
		//对value进行加密
		var encryptStr = RSAEncrypt.enctype(encryData[tempData]);
		//修改值
		encryData[tempData] = encryptStr;
	}
	//判断是否需要添加共用数据
	if(flag == 1) {

	} else if(flag == 2) {

	} else if(flag == 3) {

	}
	//将对象转为数组
	var arr0 = [];
	for(var item in encryData) {
		arr0.push(item + '=' + encryData[item]);
	};
	var arr1 = [];
	for(var item in commonData) {
		arr1.push(item + '=' + commonData[item]);
	};
	//合并数组
	var signArr = arr0.concat(arr1);
	//拼接登录需要的签名
	var signTemp = signArr.sort().join('&');
	return signTemp;
}

//修改数组，改变格式
var arrayToStr = function(array) {
	if(array == null) {
		return '[]'
	}
	var tempStr = '';
	tempStr = array.join(',');
	tempStr = '[' + tempStr + ']';
	return tempStr;
}

/**
 * 发送 XMLHttpRequest post 的请求
 * @param {Object} url 路径
 * @param {Object} data 数据
 * @param {Object} callback 回调
 */
var xhrPost = function(url, commonData, callback) {
//	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
//		callback({
//			code: 404,
//			data: null,
//			RspTxt: "网络连接失败,请重新尝试一下"
//		});
//		return;
//	}
	// console.log('XHRP-Url:', url);
	//	console.log('XHRP-Data:', commonData);
	//拼接登录需要的签名
	var signTemp = postDataEncry1({}, commonData, 0);
	// console.log('signTemp000:' + signTemp);
	//生成签名，返回值sign则为签名
	signHmacSHA1.sign(signTemp, 'jsy309', function(sign) {
		//组装发送握手协议需要的data
		//合并对象
		var tempData = $.extend({}, commonData);
		//添加签名
		tempData.sign = sign;
		// 等待的对话框
		var urlArr = url.split('/');
		// console.log('传递的参数' + urlArr[urlArr.length - 1] + ':', tempData);

		var xhr = new XMLHttpRequest();
		xhr.open("post", url, true);
		xhr.timeout = 10000; //10秒超时
		xhr.contentType = 'application/json;';
		xhr.onload = function(e) {
			// console.log("XHRP:onload:", JSON.stringify(e));
			// console.log('this.readyState:', this.readyState);
			// console.log('this.status', this.status);
			if(this.readyState === 4 && this.status === 200) {
				var urlArr = url.split('/');
				var success_data = JSON.parse(this.responseText);
				// console.log('XHRP-Success:', JSON.stringify(success_data));
				if(success_data.code == 10) { //令牌过期
					var personal = store.get(window.storageKeyName.PERSONALINFO);
					var publicPar = store.get(window.storageKeyName.PUBLICPARAMETER);
					//需要参数
					var comData = {
						user_code: personal.user.user_code,
						// appid: publicPar.appid,
						// schid: personal.schid,
						// utp: personal.utp,
						// utname: personal.utname,
						
						uuid: publicPar.uuid, //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
						webid: 'publicPar.webid', //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本））
						// shaketype: '1', //
						// login_name: tempName, //登录名
						// password: '', //
						device_type: '0', //登录设备类型，0：WEB、1：APP、2：客户端
						// platform_code: window.storageKeyName.PLATFORMCODE, //平台代码
						// app_code: window.storageKeyName.APPCODE, //应用系统代码
						// unit_code: '-1', //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
						// verify_code: ''
					};
					//令牌续订
					postDataEncry(window.storageKeyName.INTERFACE_SSO_SKIN+'token/refresh', {}, comData, 1, function(data1) {
						if(data1.code == 0) {
							var tempInfo00 = store.get(window.storageKeyName.PERSONALINFO);
							tempInfo00.utoken = data1.data;
							store.set(window.storageKeyName.PERSONALINFO, tempInfo00);
							commonData.token = data1.data;
							delete commonData.sign;
							xhrPost(url, commonData, function(data2) {
								callback(data2);
							});
						}
					});
				} else {
					callback(success_data);
				}
			} else {
				callback({
					code: 404,
					data: null,
					RspTxt: "网络连接失败,请重新尝试一下"
				});
			}
		}
		xhr.ontimeout = function(e) {
			// console.log("XHRP:ontimeout222:", e);
			callback({
				code: 404,
				data: null,
				RspTxt: "网络连接超时,请重新尝试一下"
			});
		};
		xhr.onerror = function(e) {
			// console.log("XHRP:onerror111:", e);
			callback({
				code: 404,
				data: null,
				RspTxt: "网络连接失败,请重新尝试一下"
			});
		};
		xhr.send(JSON.stringify(tempData));
	});
}

var jQAjaxPost = function(url, data, callback) {
//	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
//		callback({
//			code: 404,
//			data: null,
//			RspTxt: "网络连接失败,请重新尝试一下"
//		});
//		return;
//	}
	// console.log('jQAP-Url:', url);
	// console.log('jQAP-Data111:', data);
	jQuery.ajax({
		url: url,
		type: "POST",
		data: data,
		timeout: 10000,
		dataType: "json",
		contentType: "application/json",
		async: true,
		success: function(success_data) { //请求成功的回调
			// console.log('jQAP-Success:', success_data);
			if(success_data.code == 6||success_data.code == 'sup_0006') { //令牌过期
				var personal = store.get(window.storageKeyName.PERSONALINFO);
				var publicPar = store.get(window.storageKeyName.PUBLICPARAMETER);
				//需要参数
				var comData = {
					user_code: personal.user.user_code,
					uuid: publicPar.uuid, //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
					webid: 'publicPar.webid', //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本））
					device_type: '0', //登录设备类型，0：WEB、1：APP、2：客户端
				};
				//令牌续订
				postDataEncry(window.storageKeyName.INTERFACE_SSO_SKIN+'token/refresh', {}, comData, 1, function(data1) {
					if(data1.code == 0) {
						var tempInfo00 = store.get(window.storageKeyName.PERSONALINFO);
						tempInfo00.utoken = data1.data;
						store.set(window.storageKeyName.PERSONALINFO, tempInfo00);
						var urlArr = url.split('/');
						var tempData = JSON.parse(data);
						tempData.utoken = data1.data;
						delete tempData.sign;
						postDataEncry(urlArr[urlArr.length - 1], {}, tempData, 0, function(data2) {
							callback(data2);
						});
					}
				});
			} else {
				callback(success_data);
			}
		},
		error: function(xhr, type, errorThrown) {
			// console.log('jQAP-Error777:', xhr, type);
			callback({
				code: 404,
				data: null,
				RspTxt: "网络连接失败,请重新尝试一下"
			});
		}
	});
}

//合并参数
var extendParameter = function(data0) {
	var personal = store.get(window.storageKeyName.PERSONALINFO);
	var publicPar = store.get(window.storageKeyName.PUBLICPARAMETER);
	var tempData = {
		uuid: publicPar.uuid,
		appid: publicPar.appid,
		token: personal.utoken
	}
	return $.extend(data0, tempData);
}

//7.新增通知公告
var addNoticePro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'notice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'addNotice', data0, callback)
}