!(function(win, $, $viewEdit) {
	"use strict";
	// 通用方法
	var fn = $viewEdit.__proto__;
	fn.api = (function() {
		return {
			ajax: function(ajaxData, callback, error) {
				error = error ? error : function(data) {
					$viewEdit.layer.msg('服务器繁忙请稍后再试！');
				};
				var $this = this;
				ajaxData.url = ajaxData.url + "?t=" + Math.random();
				ajaxData.type = ajaxData.type ? ajaxData.type : "post";
				ajaxData.dataType = ajaxData.dataType ? ajaxData.dataType : "json";
				ajaxData.data = ajaxData.data ? ajaxData.data : {};
				ajaxData.error = ajaxData.error ? ajaxData.error : function(data) {
					$viewEdit.layer.closeAll('loading');
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
	fn.on = function(type,callback){
		switch (type) {
			case "uploadSuccess":
				fn.onUploadSuccess = callback;
			break;
			case "savedataSucces":
				fn.onSavedataSucces = callback;
			break;
			
		}	
	};
})(window, $, window.VE);