
  !(function(win, $) {
  	"use strict";
  	/*
	  	构建基础配置
	  */
  	var config = {
  		el: "*[page_key]",
  		// 提交地址
  		serverUrl: "/api/page/savePage",
  		// 获取资源项目地址
  		staticUrl: $("script").last().attr("src").match(/(http|https):\/\/([^\/]+)\//)[0],
  		// 保存数据附加参数
  		formData: {
  			pageUrl: window.location.pathname,
	  		// 来源设备端口
	  		port: "PC",
  		},
  		// 百度上传组件配置
  		upload: {
  			// swf文件路径
  			swf: 'http://cdn.staticfile.org/webuploader/0.1.0/Uploader.swf',
  			// 文件接收服务端。
  			server: '/api/attachment/webupload?elementid=&_time=',
  			// 内部根据当前运行是创建，可能是input元素，也可能是flash.
  			pick: {
  				id: "",
  				multiple: false,
  			},
  			//现在最大上传数
  			fileNumLimit: 9999,
  			// 上传格式
  			extensions: 'jpg|jpeg|gif|png|bmp',
  			// 是否选择就上传
  			auto: true,
  			accept: {
  				title: 'Images',
  				extensions: 'gif,jpg,jpeg,bmp,png',
  				mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png,image/bmp'
  			},
  			// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
  			resize: false
  		}

  	};

  	var viewEdit = function(api) {
  		this.v = '1.0.0';
  		// 复值config
  		this.config = (function(api,config){
  			var copyConfig = $api.copy(config);
  			if(config.upload){
  				$.extend({},config.upload, api.upload);
  			}
  			var upload = config.upload ?  : null
  			$.extend({},config, api);
  		})(api,config);
  		// 默认数据缓存队列
  		this.cacheList = new Array();

  		// 添加时间间隔
  		this.BlockDate = function() {
  			var d = new Date;
  			return d.getTime();
  		};

  		// 查找绑定可编辑的元素
  		this.el = function() {
  			return $("*[" + $t + "]");
  		};

  		// 判断图片截取规则
  		this.isOss = function($src) {
  			var retSrc = $src.match(/\@(.*)/) ? $src.match(/\@(.*)/)[0] :
  				$src.match(/\?(.*)/) ? $src.match(/\?(.*)/)[0] : "";
  			return retSrc;
  		};

  		// 判断取出图片地址
  		this.isSrc = function($src) {
  			var retSrc = $src.match(/(.*)\@/) ? $src.match(/(.*)\@/)[1] :
  				$src.match(/(.*)\?/) ? $src.match(/(.*)\?/)[1] : $src;
  			return retSrc;
  		};

  	};

  	var $api = (function() {
  		return {
  			ajax: function(ajaxData, callback, error) {
  				error = error ? error : function() {};
  				var $this = this;
  				ajaxData.url = ajaxData.url + "?t=" + Math.random();
  				ajaxData.type = ajaxData.type ? ajaxData.type : "post";
  				ajaxData.dataType = ajaxData.dataType ? ajaxData.dataType : "json";
  				ajaxData.data = ajaxData.data ? ajaxData.data : {};
  				ajaxData.error = ajaxData.error ? ajaxData.error : function(data) {
  					layer.closeAll('loading');
  					error(data);
  				};
  				ajaxData.success = function(data) {
  					callback(data);
  				};
  				$.ajax(ajaxData);
  			},
  			copy:function copy(obj){
				    if(typeof obj != 'object'){
				        return obj;
				    }
				    var newobj = {};
				    for ( var attr in obj) {
				        newobj[attr] = deepCopy(obj[attr]);
				    }
				    return newobj;
				},
  			loadJS: function(url, callback) {
  				var $this = this;
  				switch (typeof url) {
  					case "object":
  						var urlLength = url.length,
  							defLength = 1;
  						$.each(url, function(i, url) {
  							var head = document.getElementsByTagName("head")[0];
  							var script = document.createElement("script");
  							script.src = url + "?" + $this.v;
  							var done = false;
  							script.onload = script.onreadystatechange = function() {
  								if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
  									done = true;
  									if (defLength >= urlLength) {
  										return callback();
  									}
  									defLength++;
  									script.onload = script.onreadystatechange = null;
  									head.removeChild(script);
  								}
  							};
  							head.appendChild(script);
  						});
  						break;
  					default:
  						var head = document.getElementsByTagName("head")[0];
  						var script = document.createElement("script");
  						script.src = url + "?" + $this.v;
  						var done = false;
  						script.onload = script.onreadystatechange = function() {
  							if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
  								done = true;
  								callback();
  								script.onload = script.onreadystatechange = null;
  								head.removeChild(script);
  							}
  						};
  						head.appendChild(script);

  				}
  			}
  		}
  	})();

  	viewEdit.fn = viewEdit.prototype;


  	//异常提示
  	var error = function(msg) {
  		win.console && console.error && console.error('viewEidt hint: ' + msg);
  	};
  	win.viewEdit = new viewEdit({
  		el:"page_key",
  		upload:{
  			server:"测试"
  		}
  	});
  	console.log(win.viewEdit);
  })(window, $);