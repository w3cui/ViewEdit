!(function(win, $, $viewEdit) {
	"use strict";
	// 通用方法
	var fn = $viewEdit.__proto__;
	fn.api = (function() {
		return {
			ajax: function(ajaxData, callback, error) {
				error = error ? error : function(data) {
					$viewEdit.popup.msg('服务器繁忙请稍后再试！');
				};
				var $this = this;
				ajaxData.url = ajaxData.url + "?t=" + Math.random();
				ajaxData.type = ajaxData.type ? ajaxData.type : "post";
				ajaxData.dataType = ajaxData.dataType ? ajaxData.dataType : "json";
				ajaxData.data = ajaxData.data ? ajaxData.data : {};
				ajaxData.error = ajaxData.error ? ajaxData.error : function(data) {
					$viewEdit.popup.closeAll('loading');
					error(data);
				};
				ajaxData.success = function(data) {
					callback(data);
				};
				$.ajax(ajaxData);
			},

			copy: function(obj) {
				if (typeof obj != 'object') {
					return obj;
				}
				var newobj = {};
				for (var attr in obj) {
					newobj[attr] = $viewEdit.api.copy(obj[attr]);
				}
				return newobj;
			}
		};
	})();
	
	// 设置回调
	fn.on = function(type,callback){
		switch (type) {
			case "uploadSuccess":
				fn.onUploadSuccess = callback;
			break;
			case "savedataSucces":
				fn.onSavedataSucces = callback;
			break;
			case "modifySucces":
				fn.onModifySucces = callback;
			break;
			
		}
	};

	// 页面统一处理
	fn.modify = function(){
		if(!this.onModifySucces) return false;
		var html = $("<div>"+$($viewEdit.config.outerEvent).html()+"</div>");
		html.find(".Blickcookroom,.blockbk,.ve_remove").remove()
		this.onModifySucces(html.html());
	}
})(window, $, window.VE);