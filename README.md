# ViewEdit.js 
页面可视化编辑，提供图片上传，模块新增加，文本修改等功能！

## 技术栈

 - gulp + gulp-concat + gulp-connect + gulp-header + gulp-minify-css + gulp-open + gulp-uglify
 - ["jquery": "^3.2.1"]
 - ["webuploader": "^0.1.8"]
 - ["html2canvas": "^0.5.0-beta4"]

## gulp便宜命令

克隆远程库
```
git clone https://github.com/w3cui/ViewEdit.git
```
进入项目目录ViewEdit后，安装依赖
```
npm install
```
依赖安装完毕
```
gulp 发布压缩版本
gulp all 发布完整版本
gulp local 开发预览
```

## 功能展示

![Image text](http://www.w3cui.com/wp-content/uploads/2014/12/333.gif)

**ViewEdit**

使用：

1.模板配置

```

<!-- ve-key 是下方 @el => 名称 -->

<div ve-key >
	<p>双击编辑文本</p>
	<p><a href="">链接编辑</a></p>

	<!-- ve-add-tpl 是下方 @addTemplate => 名称 -->

	<img ve-add-tpl  data-original="http://pic.qiantucdn.com/58pic/22/06/55/57b2d9a265f53_1024.jpg?x-oss-process=image/resize,w_250,h_250" src="http://pic.qiantucdn.com/58pic/22/06/55/57b2d9a265f53_1024.jpg?x-oss-process=image/resize,w_250,h_250" alt="" style="display: block;">
</div>

```

2.应用初始参数

```

VE.init({
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
});

```

需要改进的有很多，请大家可以多提提意见。后续我会不断改进，如果觉得还可以，请star，你们的star是我前进的动力。


