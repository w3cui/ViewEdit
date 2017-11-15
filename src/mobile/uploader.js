!(function(win, $, $viewEdit) {
	"use strict";
	var fn = $viewEdit.__proto__;
	var config = $viewEdit.config;
	fn.webUploader = function(_this) {
		var index;
		config.upload.pick.id = _this;
		var uploader = WebUploader.create(config.upload);

		// 判断格式
		uploader.on("error", function(type) {
			//仅支持JPG、GIF、PNG、JPEG、BMP格式，
			if (type == 'F_EXCEED_SIZE' || type == 'Q_EXCEED_SIZE_LIMIT') {
				//alert("上传的图片太大");
				$viewEdit.layer.msg("上传的图片太大");
				return false;
			} else if (type == "Q_TYPE_DENIED") {
				$viewEdit.layer.msg("请上传JPG、GIF、PNG、JPEG、BMP格式");
				return false;
			} else if (type == "Q_EXCEED_NUM_LIMIT") {

				$viewEdit.layer.msg("超过图片最大上传数量");
				return false;
			} else {
				$viewEdit.layer.msg("服务器繁忙请稍候再试");
				return false;
			}
		});

		// 生成预览图
		uploader.on("fileQueued", function(file, percentage) {
			index = $viewEdit.layer.load(0, {
				shade: [0.1, '#fff']
			});
		});

		// 服务器回调
		uploader.on('uploadSuccess', function(file, response) {
			$viewEdit.layer.close(index);

			// 自定义回调处理
			if(fn.onUploadSuccess){
				fn.onUploadSuccess(_this, file, response);
				return false;
			};

			if (response.code == 200) {
				$(_this).parent().find("img").attr("src", response.fileurl);
				$(_this).parents("li").find("input[name='urlsrc']").val(response.fileurl);
			} else {
				if (response.code == 0) {
					$(_this).parent().find("img").attr("src", response.result);
					$(_this).parents("li").find("input[name='urlsrc']").val(response.result);
				} else {
					alert("服务器繁忙请稍后再试...");
				}
				//$viewEdit.layer.msg("服务器繁忙请稍后再试...")
			}
			
		});
		//所有文件上传后触发    
		uploader.on('uploadError', function(file) {
			$viewEdit.layer.close(index);			
			$viewEdit.layer.msg("服务器链接失败！");
		});

	};
})(window, $, window.VE);