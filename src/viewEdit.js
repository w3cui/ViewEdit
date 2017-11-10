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

	var viewEdit = function() {
		this.v = '1.0.0';
		
		// 查找绑定可编辑的元素
		this.el = () => {
			return $("*[" + $t + "]");
		};

		// 复值config
		this.config = config;

		// 默认数据缓存队列
		this.cacheList = new Array();

		// 初始化
		this.init = (api) => {
			var $this = this;
			this.config = (function(api, config) {
				var copyConfig = $this.api.copy(config);			
				$.extend(copyConfig, api);

				if (api.upload) {
					var upload = $this.api.copy(config.upload);
					$.extend(upload, api.upload);
					copyConfig.upload = upload;
				}
				return copyConfig;
			})(api, config); 
			return this;
		}
		
	};
	
	var fn = viewEdit.prototype;

	// 判断取出图片地址 
	fn.isSrc = ($src) => {
		var retSrc = $src.match(/(.*)\@/) ? $src.match(/(.*)\@/)[1] :
			$src.match(/(.*)\?/) ? $src.match(/(.*)\?/)[1] : $src;
		return retSrc;
	};

	// 添加时间间隔
	fn.BlockDate =  () => {
		var d = new Date;
		return d.getTime();
	};
	// 判断图片截取规则
	fn.isOss = ($src) => {
		var retSrc = $src.match(/\@(.*)/) ? $src.match(/\@(.*)/)[0] :
			$src.match(/\?(.*)/) ? $src.match(/\?(.*)/)[0] : "";
		return retSrc;
	};

	//异常提示
	var error = (msg) => {
		win.console && console.error && console.error('viewEidt hint: ' + msg);
	}; 
	win.VE = new viewEdit();

})(window, $);