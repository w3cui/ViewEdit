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
})(window, $);