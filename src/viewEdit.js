!(function(win, $) {
	"use strict";
	/*
	  	构建基础配置
	  */
	var $config = {
		// 绑定编辑模块KEY
		el: "ve-key",
		// 标签内部新增key
		addTemplate:"ve-add-tpl",
		// 提交地址
		serverUrl: "/api/page/savePage",
		// 扩展按钮
		btn: "<a>退出</a>",
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

	var $VE = function() {
		this.v = '1.0.0';
	}; 

	var fn = $VE.prototype;
	// 查找绑定可编辑的元素
	fn.el = function() {
		return $("*[" + $config.el + "]");
	};
	// 初始化
	fn.init = function(api) {
		var $this = this;
		$config = $.extend(true,$config,api);
		// 启动插件
		this.resize();
		return this;
	}

	// 默认数据缓存队列
	fn.cacheList = function(){
		var cacheList = [];
		var $this = this;
		$.each(this.el(), function() {
			var valData = {
				"key": $(this).attr($config.el),
				"value": $(this).html()
			};
			cacheList.push(valData);
		});
		return cacheList;
	};

	// 复值$config
	fn.config = function(){
		return this.api.copy($config);
	};

	// 判断取出图片地址 
	fn.isSrc = function($src) {
		var retSrc = $src.match(/(.*)\@/) ? $src.match(/(.*)\@/)[1] :
			$src.match(/(.*)\?/) ? $src.match(/(.*)\?/)[1] : $src;
		return retSrc;
	};

	// 添加时间间隔
	fn.BlockDate = function() {
		var d = new Date;
		return d.getTime();
	};

	// 判断图片截取规则
	fn.isOss = function($src) {
		var retSrc = $src.match(/\@(.*)/) ? $src.match(/\@(.*)/)[0] :
			$src.match(/\?(.*)/) ? $src.match(/\?(.*)/)[0] : "";
		return retSrc;
	};

	//异常提示
	var error = function(msg) {
		win.console && console.error && console.error('viewEidt hint: ' + msg);
	};

	window.VE = new $VE();
})(window, $);