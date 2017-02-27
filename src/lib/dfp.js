var model = {};
var cookie_name = 'higinet_tms_dfp';
var deviceFinger = '';
var swfPath = "/tmsdfp/flashProperty.swf";
var cookie_flash = null;
var murmurhash3_32_gc = function (key, seed) {
    var remainder, bytes, h1, h1b, c1, c2, k1, i;
    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;
    while (i < bytes) {
        k1 =
          ((key.charCodeAt(i) & 0xff)) |
          ((key.charCodeAt(++i) & 0xff) << 8) |
          ((key.charCodeAt(++i) & 0xff) << 16) |
          ((key.charCodeAt(++i) & 0xff) << 24);
      ++i;

      k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

      h1 ^= k1;
          h1 = (h1 << 13) | (h1 >>> 19);
      h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
      h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
      case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
      case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
      case 1: k1 ^= (key.charCodeAt(i) & 0xff);

      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
};
var replaceDfpValue = function(value){
	var deviceInfoNew = "";
	var params = value.split("|");
	for (var i = 0; i < params.length; i++) {
		var param = params[i];
		if(param.indexOf(":") != -1){
			var key = param.substring(0, param.indexOf(":"));
			var value = param.substring(param.indexOf(":") + 1, param.length);
			if(value.length > 100){
				value = murmurhash3_32_gc(value);
			}
			if(i>0){
				deviceInfoNew += "|";
			}
			deviceInfoNew += key + ":" + value; 
		}
	}
	return deviceInfoNew;
};

model.dfpFunData = {
	getTimezoneOffsetFun : function (){
	     var munites = new Date().getTimezoneOffset();   //  +08:00
	     var hour = parseInt(munites / 60);
	     var munite = munites % 60;
	     var prefix = "-";
	     if (hour < 0 || munite < 0) {
	         prefix = "+";
	         hour = -hour;
	         if (munite < 0) {
	              munite = -munite;
	         }
	     }
	     hour = hour + "";
	     munite = munite + "";
//	     if (hour.length == 1) {
//	         hour = "0" + hour;
//	     }
	     if (munite.length == 1) {
	         munite = "0" + munite;
	     }
	     return "GMT"+prefix + hour + ":" + munite;
	},
	getBrowserEngineFun : function (){
 		var u = navigator.userAgent;
 		if(u.indexOf('Trident') > -1 ){
 			return "trident";
 		}
 		if(u.indexOf('Presto') > -1){
 			return "presto";
 		}
 		if(u.indexOf('AppleWebKit') > -1){
 			return "webKit";
 		}
 		if(u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1){
 			return "gecko";
 		}
 		if(u.match(/AppleWebKit.*MOBILE.*/)||u.match(/AppleWebKit/)){
 			return "mobile";
 		}
 		if(u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
 			return "ios";
 		}
 		if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
 			return "android";
 		}
 		if(u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1){
 			return "iPhone";
 		}
 		if(u.indexOf('iPad') > -1){
 			return "iPad";
 		}
 		if(u.indexOf('Safari') == -1){
 			return "webApp";
 		}
 		return "";
 	},
 	getOsVersionFun : function () {
 		if(navigator.userAgent.indexOf("Windows") != -1){
			return navigator.userAgent.match(/Windows NT [0-9]*\.[0-9]/);
		}else if(navigator.userAgent.indexOf("Android") != -1){
			var os = navigator.userAgent.match(/Android \d+\.\d+\.\d+/);
			if(os != null && os != undefined){
				return os;
			}
			os = navigator.userAgent.match(/Android \d+\.\d/);
			if(os != null && os != undefined){
				return os;
			}
			os = navigator.userAgent.match(/Android \d/);
			if(os != null && os != undefined){
				return os;
			}
			return "Android";
		}else{
	 		var osVersion = navigator.userAgent.match(/\(.*;.*\)/);
			if(osVersion instanceof Array){
				osVersion = osVersion[0];
			}
			return osVersion.substr(1,osVersion.indexOf(";")-1);
		}
 	},
 	getSessionStorageFun : function () {
 		try{
        	return !!window.sessionStorage;
      	} catch(e) {
        	return false;
     	};
 	},
 	getLocalStorageFun : function () {
 		try{
        	return !!window.localStorage;
	    } catch(e) {
	    	return false;
	    };
 	},
 	getAddBehaviorFun : function () {
 		if(document.body) {
	    	return typeof(document.body.addBehavior);
	    } else {
	    	return typeof undefined;
	    }
 	},
 	getOpenDatabaseFun : function(){
 		return typeof(window.openDatabase);
 	},
 	getPluginsFun : function(){
 		var isIE = function () {
	    	if(navigator.appName === 'Microsoft Internet Explorer') {
	    		return true;
		    } else if(navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)){// IE 11
		    	return true;
		    }
	    	return false;
	    };
	    var getIEPluginsString = function () {
        	if(window.ActiveXObject){
        		var names = ['ShockwaveFlash.ShockwaveFlash',//flash plugin
		          'AcroPDF.PDF', // Adobe PDF reader 7+
		          'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
		          'QuickTime.QuickTime', // QuickTime
		          // 5 versions of real players
		          'rmocx.RealPlayer G2 Control',
		          'rmocx.RealPlayer G2 Control.1',
		          'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
		          'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
		          'RealPlayer',
		          'SWCtl.SWCtl', // ShockWave player
		          'WMPlayer.OCX', // Windows media player
		          'AgControl.AgControl', // Silverlight
		          'Skype.Detection'];
	        	return map(names, function(name){
	          		try{
	            		new ActiveXObject(name);
	            		return name;
	          		} catch(e){
	            		return null;
	          		};
	        	}).join(';');
      		} else {
        		return ""; // behavior prior version 0.5.0, not breaking backwards compat.
      		};
    	};
    	var nativeForEach = Array.prototype.forEach;
    	var nativeMap = Array.prototype.map;
    	var each = function (obj, iterator, context) {
      		if (obj === null) {
        		return;
      		}
      		if (nativeForEach && obj.forEach === nativeForEach) {
        		obj.forEach(iterator, context);
      		} else if (obj.length === +obj.length) {
        		for (var i = 0, l = obj.length; i < l; i++) {
          			if (iterator.call(context, obj[i], i, obj) === {}) {
          				return;
          			}
		        }
      		} else {
        		for (var key in obj) {
          			if (obj.hasOwnProperty(key)) {
			            if (iterator.call(context, obj[key], key, obj) === {}){
				            return;
			            } 
          			}
		        }
      		}
    	};
    	var map = function(obj, iterator, context) {
      		var results = [];
      		if (obj == null) return results;
      		if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      		each(obj, function(value, index, list) {
        		results[results.length] = iterator.call(context, value, index, list);
      		});
      		return results;
    	};
    	var getRegularPluginsString = function () {
      		return map(navigator.plugins, function (p) {
        		var mimeTypes = map(p, function(mt){
          			return [mt.type, mt.suffixes].join('~');
        		}).join(',');
        		return [p.name].join('::');
      		}, this).join(';');
    	};
	    if(isIE()){
	        return murmurhash3_32_gc(getIEPluginsString());
	    } else {
	        return murmurhash3_32_gc(getRegularPluginsString());
	    };
 	},
 	getCanvasFingerprintFun: function () {
	   try{
		   	var canvas = document.createElement('canvas');
		   	var ctx = canvas.getContext('2d');
		   	var txt = 'http://www.higinet.com.cn';
		   	ctx.textBaseline = "top";
		   	ctx.font = "14px 'Arial'";
		   	ctx.textBaseline = "alphabetic";
		   	ctx.fillStyle = "#f60";
		   	ctx.fillRect(125,1,62,20);
		   	ctx.fillStyle = "#069";
		   	ctx.fillText(txt, 2, 15);
		   	ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
		   	ctx.fillText(txt, 4, 17);
		   	return murmurhash3_32_gc(canvas.toDataURL(),31);
	   	}catch(e){
		   		return "";    
		}
	},
 	getBrowserFun:function(){
		var NV = {};
		var UA = navigator.userAgent.toLowerCase();
		try{
			NV.name=!-[1,]?'ie':
			(UA.indexOf("firefox")>0)?'firefox':
			(UA.indexOf("chrome")>0)?'chrome':
			window.opera?'opera':
			window.openDatabase?'safari':
			'unkonw';
		}catch(e){};
		try{
			NV.version=(NV.name=='ie')?UA.match(/msie ([\d.]+)/)[1]:
			(NV.name=='firefox')?UA.match(/firefox\/([\d.]+)/)[1]:
			(NV.name=='chrome')?UA.match(/chrome\/([\d.]+)/)[1]:
			(NV.name=='opera')?UA.match(/opera.([\d.]+)/)[1]:
			(NV.name=='safari')?UA.match(/version\/([\d.]+)/)[1]:
			'0';
		}catch(e){};
		try{
			NV.shell=(UA.indexOf('360ee')>-1)?'360ee':
			(UA.indexOf('360se')>-1)?'360se':
			(UA.indexOf('aoyou')>-1)?'aoyou':
			(UA.indexOf('theworld')>-1)?'theworld':
			(UA.indexOf('worldchrome')>-1)?'worldchrome':
			(UA.indexOf('greenbrowser')>-1)?'greenbrowser':
			(UA.indexOf('qqbrowser')>-1)?'qqbrowser':
			(UA.indexOf('baidu')>-1)?'baidu':
			(UA.indexOf('ucbrowser')>-1)?'ucbrowser':
			(UA.indexOf('se')>-1)?'se':
			null;
		}catch(e){};
		if(NV.shell == null || NV.shell == undefined){
			return NV.name + (NV.version == undefined ? "" : (" " + NV.version));
		}else{
			return NV.shell + (NV.version == undefined ? "" : (" " + NV.version));
		}
	},
	getColorDepthFun:function(){
//		if(screen.colorDepth == "24"){
//			return "32";
//		}
		return screen.colorDepth;
	}
};
model.dfp = {
/**功能---采集客户端设备的JS属性和flash属性
  *在页面加载完后调用，var dfp = model.dfp.getDfpValues(); dfp(); //开始采集
  *方法说明：
  *getDfpValues() 采集设备指纹
  *getDeviceToken() 获取设备标识
  *getDeviceFinger（） 获取设备指纹
  *setCookie() 把设备标识放入cookie
  *getCookie() 获取设备指纹
  */
	 getDfpValues: function(objectContainer){
		var pathName = document.location.pathname;
		var index = pathName.substr(1).indexOf("/");
		var result = index == -1 ? pathName : pathName.substr(0,index+1);
		var curPath = window.location.href;
		var flashPath = curPath.substr(0,curPath.indexOf(pathName)) + result + swfPath;
//		var flashPath = 'http://10.8.1.237/tmsdfp/flashProperty.swf';
		var flashId = "as";
		var FlashMaxLoad = 10;
		var dfp_values = "";
		try {
//			objectContainer.innerHTML = "<object defer classid='clsid:D27CDB6E-AE6D-11CF-96B8-444553540000' id='as' name='as' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0'  width='1' height='1'>  <param name='allowScriptAccess' value='sameDomain' />   <param name='movie' value='" + flashPath + "'/>	<param name='quality' value='High'/><param name='menu' value='false'/><embed allowScriptAccess='sameDomain' id='as' name='as' src='"+flashPath+"' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' name='Main' id='Main' width='1' height='1' quality='High' menu='false'></object>";
			// document.write("<div style=\"width: 0;height: 0;\"><object defer classid='clsid:D27CDB6E-AE6D-11CF-96B8-444553540000' id='as' name='as' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0'  width='1' height='1'>  <param name='allowScriptAccess' value='sameDomain' />   <param name='movie' value='"+flashPath+"'/>	<param name='quality' value='High'/><param name='menu' value='false'/><embed allowScriptAccess='sameDomain' id='as' name='as' src='"+flashPath+"' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' name='Main' id='Main' width='1' height='1' quality='High' menu='false'></object></div>");
//			var deviceJsProperty = 'ssd1:3|ER1111111:1|OS_Version:4001|language,browserLanguage:4002|userAgent:4003|width*height:4005|pixelDepth:4007|getTimezoneOffsetFun:4008|appName:4023|appVersion:4024|cookieEnabled:4025|platform:4028|cpuClass:4029|director:4030|javaEnabled:4031|plugins:4033|systemLanguage:4041|taintEnabled:4042|userAgent:4043|appCodeName:4071|appMinorVersion:4072|availHeight:4087|availWidth:4088|bufferDepth:4078|colorDepth:4089|deviceXDPI:4079|deviceYDPI:4080|fontSmoothingEnabled:4081|height:4090|language:4044|logicalXDPI:4082|logicalYDPI:4083|msDoNotTrack:4076|msManipulationViewsEnabled:4073|msMaxTouchPoints:4074|msPointerEnabled:4075|onLine:4077|pixelDepth:4091|systemXDPI:4084|systemYDPI:4085|updateInterval:4086|width:4092';
			var deviceJsProperty = 'getOsVersionFun:1|language,browserLanguage:2|userAgent:3|width*height:5|getColorDepthFun:7|getTimezoneOffsetFun:8|getBrowserFun:11|getBrowserEngineFun:12|userProfile:13|getCanvasFingerprintFun:14|getPluginsFun:15|platform:16|onLine:17|appMinorVersion:22|taintEnabled:23|systemLanguage:24|language:27|cookieEnabled:28|availWidth*availHeight:29|updateInterval:33|logicalYDPI:34|logicalXDPI:35|bufferDepth:36|deviceXDPI:37|deviceYDPI:38|width:39|fontSmoothingEnabled:40|getSessionStorageFun:101|getLocalStorageFun:102|indexedDB:103|getAddBehaviorFun:104|cpuClass:106|doNotTrack:107';
//			var devicePluginProperty = 'pluginCount:4034|QuickTime:4035|Flash:4107|Media Player:4106';
			var devicePluginProperty = '';
//			var deviceFlashProperty = 'version:4026|avHardwareDisable:4057|hasAccessibility:4070|hasAudio:4058|hasAudioEncoder:4059|hasEmbeddedVideo:4060|hasIME:4048|hasMP3:4062|hasPrinting:4069|hasScreenBroadcast:4063|hasScreenPlayback:4064|hasStreamingAudio:4065|hasStreamingVideo:4066|hasTLS:4067|hasVideoEncoder:4061|isDebugger:4049|language:4047|localFileReadDisable:4068|manufacturer:4051|os:4046|pixelAspectRatio:4054|playerType:4050|screenColor:4056|screenDPI:4055|screenResolutionX:4052|screenResolutionY:4053|cpuArchitecture:4098|isEmbeddedInAcrobat:4100|maxLevelIDC:4094|prototype:4097|serverString:4099|supports32BitProcesses:4095|supports64BitProcesses:4096|touchscreenType:4093';
			var deviceFlashProperty = 'pixelAspectRatio:4|screenDPI:6|os:9|cpuArchitecture:10|hasStreamingAudio:41|hasStreamingVideo:42|hasScreenPlayback:43|hasMP3:44|hasScreenBroadcast:45|hasAccessibility:46|isEmbeddedInAcrobat:47|hasPrinting:48|hasTLS:49|localFileReadDisable:50|hasVideoEncoder:51|serverString:52|hasIME:53|language:54|maxLevelIDC:56|touchscreenType:57|supports32BitProcesses:58|supports64BitProcesses:59|isDebugger:60|avHardwareDisable:61|screenColor:62|hasAudio:63|hasEmbeddedVideo:64|hasAudioEncoder:65|manufacturer:67|playerType:68';
			var deviceComProperty = '';
			return function() {
				function rd(x) {
					x = x + "";
					x = x.replace(/\|/g, 'A');
					x = x.replace(/:/g, "B");
					return x;
				}
				var pluginCount = 0;
//				function isIEPlugin(plugin) {
//					var IEPlugin = "Flash:ShockwaveFlash.ShockwaveFlash|Media Player:MediaPlayer.MediaPlayer|QuickTime:QuickTime.QuickTime";
//					var IEPluginArray = IEPlugin.split("|");
//					var IEPluginArrayLength = IEPluginArray.length;
//					for ( var m = 0; m < IEPluginArrayLength; m++) {
//						try {
//							if (plugin == IEPluginArray[m].match(/^(.*)(:)(.{1,40})$/)[1]) {
//								new ActiveXObject(IEPluginArray[m].match(/^(.*)(:)(.{1,40})$/)[3]);
//								pluginCount++;
//								return true;
//							}
//						} catch (e) {
//							return false;
//						}
//					}
//					return false;
//				}
				var pluginNameString = "";
				if (navigator.appName.indexOf("Microsoft") == -1)
					for ( var subProp in navigator["plugins"]) {
						pluginNameString = pluginNameString + rd(navigator["plugins"][subProp].name)+ ";";
						pluginCount++;
					}
				var deviceJsPropertyArray = deviceJsProperty.split("|");
				var deviceJsPropertyArrayLength = deviceJsPropertyArray.length;
				var prop = "";
				var prop_value = "";
				for ( var i = 0; i < deviceJsPropertyArrayLength; i++) {
					var dpa = deviceJsPropertyArray[i].match(/^(.*)(:)(.{1,8})$/);
					if(dpa == null || dpa.length == 0) continue;
					prop = dpa[1];
					prop_value = dpa[3];
					var default_values = dfp_values;
					dfp_values = dfp_values + prop_value + ":";
					if (prop in navigator){
						if (prop == "javaEnabled" || prop == "taintEnabled") 
							dfp_values = dfp_values + rd(eval("navigator." + prop+ "()")) + "|";
						else if (prop == "appVersion" && navigator.appName.indexOf("Microsoft") != -1)
							dfp_values = dfp_values + rd(navigator[prop].match(/^(.*)(IE )(.*)(; Windows)(.*)$/)[3])+ "|";
//						else if (prop == "userAgent" && navigator.appName.indexOf("Microsoft") != -1)
//							dfp_values = dfp_values + rd(navigator[prop].match(/^(.*)(; )(.*)(\))(.*)$/)[3])+ "|";
						else if (prop == "plugins" && navigator.appName.indexOf("Microsoft") != -1) 
							dfp_values = dfp_values + "object" + "|";
						else dfp_values = dfp_values + rd(navigator[prop]) + "|";
					} else if (prop in screen){
						if (screen[prop].toString().indexOf("function") >= 0)
							dfp_values = dfp_values + rd(eval("screen." + prop + "()")) + "|";
						else
							dfp_values = dfp_values + rd(screen[prop])+ "|";
					}else if(prop.indexOf(",") != -1){
						var props = prop.split(",");
						for (var j = 0; j < props.length; j++){
							var value = navigator[props[j]]; 
							if(value != null && value != undefined){
								value = value.toString();
								value = value.toLocaleLowerCase();
								dfp_values += value + "|";
								break;
							}
						}
					}else if(prop.indexOf("*") != -1){
						var props = prop.split("*");
						var value = ""; 
						for (var j = 0; j < props.length; j++){
							if(screen[props[j]] != null && screen[props[j]] != undefined){
								value += screen[props[j]] + "*";
							}
						}
						value = value.substr(0, value.length - 1);
						dfp_values += value + "|";
					}else if(model.dfpFunData[prop] != null && model.dfpFunData[prop] != undefined){
						var fun = model.dfpFunData[prop];
						dfp_values += fun() + "|";
					}else{
						dfp_values = default_values;
					}
				}
				dfp_values = dfp_values.substr(0, dfp_values.length - 1);
				var devicePluginPropertyArray = devicePluginProperty.split("|");
				var devicePluginPropertyArrayLength = devicePluginPropertyArray.length;
				var prop_plugin = "";
				var prop_plugin_value = "";
				var dfp_plugin_values = "";
				var isExistPluginCount = false;
				var pluginCountId = "";
//				for ( var i = 0; i < devicePluginPropertyArrayLength; i++) {
//					var dpa = devicePluginPropertyArray[i].match(/^(.*)(:)(.{1,8})$/);
//					if(dpa == null || dpa.length == 0) continue;
//					prop_plugin = dpa[1];
//					prop_plugin_value = dpa[3];
//					if (prop_plugin == "pluginCount"){
//						isExistPluginCount = true;
//						pluginCountId = prop_plugin_value + ":";
//					}
//				}
				if(isExistPluginCount)
					dfp_plugin_values = dfp_plugin_values + pluginCountId + pluginCount + "|";
				if(dfp_plugin_values.length > 0){dfp_values = dfp_values + "|" + dfp_plugin_values.substr(0, dfp_plugin_values.length - 1);}
				deviceFinger = dfp_values;
				var flashObject;
				if (navigator.appName.indexOf("Microsoft") != -1)
					flashObject = window[flashId];
				else
					flashObject = document.embeds[flashId];
				var pollCount = 0;
				dfp_values = "";
				var interval = setInterval(
				function() {
					try {
						if (pollCount > FlashMaxLoad * 10){
//							document.getElementById(flashId).style.display = "none";
							clearInterval(interval);
						}
						pollCount++;
						if (navigator.appVersion.indexOf("MSIE 10") != -1){
							dfp_values = flashObject[0].jsGetDeviceFlashProperty(deviceFlashProperty);
							cookie_flash = flashObject[0].getData(cookie_name);
						}else{
							dfp_values = flashObject.jsGetDeviceFlashProperty(deviceFlashProperty);
							cookie_flash = flashObject.getData(cookie_name);
						}
						dfp_values = replaceDfpValue(dfp_values);
						if (dfp_values.length > 10) {
							dfp_values = XMLEncode(dfp_values);
							deviceFinger = dfp_values + "|" + deviceFinger;
//							document.getElementById(flashId).style.display = "none";
							clearInterval(interval);
						}
					} catch (ex) {pollCount++;}
				}, 100);
				function getcom1() {return "1";}
				function getcom2() {return "2";}
				function getcom3() {return "3";}
				function getcom4() {return "4";}
				function getcom5() {return "5";}
				var deviceComPropertyArray = deviceComProperty.split("|");
				var deviceComPropertyArrayLength = deviceComPropertyArray.length;
				var comProp = "";
				var dfp_com_values = "";
				dfp_values = "";
				for ( var i = 0; i < deviceComPropertyArrayLength; i++) {
					var dpa = deviceComPropertyArray[i].match(/^(.*)(:)(.{1,8})$/);
					if(dpa == null || dpa.length == 0) continue;					comProp = deviceComPropertyArray[i].match(/^(.*)(:)(.{1,8})$/)[1];
					comProp_value = deviceComPropertyArray[i].match(/^(.*)(:)(.{1,8})$/)[3];
					dfp_values = dfp_values + comProp_value + ":"+ rd(eval("get" + comProp + "()")) + "|";
			}
			if(dfp_values.length > 0){
				deviceFinger += "|" +  dfp_values.substr(0, dfp_values.length - 1);
			}
		};} catch (ex) {}
	},
	setCookie:function (value)
	{
			if(value == null || value == undefined ||value.length==0) return;
			var Days = 365 * 10;
			var exp = new Date();
			exp.setTime(exp.getTime() + Days*24*60*60*1000);
			document.cookie = cookie_name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path=/";
			//写入flash 共享对象
			var flashId = "as";
			var pollCount = 0;
			var flashMaxLoad = 2;
			var flashObject = null;
			var flashObject;
			if (navigator.appName.indexOf("Microsoft") != -1){
				flashObject = window[flashId];
			}else{
				flashObject = document.embeds[flashId];
			}
			try{
				document.getElementById(flashId).style.display = "";
				var interval = setInterval(
					function() {
						try {
							if (pollCount > flashMaxLoad * 10){
								document.getElementById(flashId).style.display = "none";
								clearInterval(interval);
							}
							pollCount++;
							if (navigator.appVersion.indexOf("MSIE 10") != -1){
								flashObject[0].putData(cookie_name,value);
							}else{
								flashObject.putData(cookie_name,value);
							}
							cookie_flash = value;
							document.getElementById(flashId).style.display = "none";
							clearInterval(interval);
						} catch (ex) {
							pollCount++;
						}
					},
					100
				);
			} catch (ex) {
			}
	},
	getCookie: function()
	{
		if(cookie_flash){
			return cookie_flash;
		}else{
			var arrStr = document.cookie.split("; ");
			for (var i = 0; i < arrStr.length; i++) {
				var temp = arrStr[i].split("=");
				if (temp[0] == cookie_name) 
					return unescape(temp[1]);
			}
		}
	},
	getDeviceToken: function()
	{
			var deviceToken = '';
			var d = model.dfp.getCookie();
			if(d !=null && d!=undefined && d!=''){
				deviceToken=d;
			}
			return deviceToken;
	},
	getDeviceFinger: function()
	{
		var device_type = "";
		if((navigator.platform =="Win32") || (navigator.platform =="Windows") || (navigator.platform=="Win64")){
			device_type = "6";
		}else if(navigator.userAgent.indexOf("Macintosh")>0){
			device_type = "8";
		}else if(navigator.userAgent.toLowerCase().match(/(iphone|ipad|ipod|ios)/i)){
			device_type = "4";
		}else if(navigator.userAgent.toLowerCase().match(/android/i)){
			device_type = "2";
		}else{
			device_type = "2";
		}
		deviceFinger = deviceFinger.replace(/true/g, "1").replace(/false/g, "0");
		return device_type + "|" + deviceFinger;
	}
	
};
function XMLEncode(str)
{
		if(str == null || str.length == 0) return '';
     str=str.replace(new RegExp('&','g'),"&amp;");
     str=str.replace(new RegExp('<','g'),"&lt;");
     str=str.replace(new RegExp(">",'g'),"&gt;");
     str=str.replace(new RegExp("'",'g'),"&apos;");
     str=str.replace(new RegExp("\"",'g'),"&quot;");
     return str;
};

module.exports = {
    getDeviceInfo: function(){
        model.dfp.getDfpValues()();
        
		return {
			finger: model.dfp.getDeviceFinger(),
			token: model.dfp.getDeviceToken()
		}
    }
};