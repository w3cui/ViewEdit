!(function(win, $, $viewEdit) {
	"use strict";
	$viewEdit.__proto__.api = (function ()  {
		return {

			ajax: (ajaxData, callback, error) => {
				error = error ? error : function() {};
				var $this = this;
				ajaxData.url = ajaxData.url + "?t=" + Math.random();
				ajaxData.type = ajaxData.type ? ajaxData.type : "post";
				ajaxData.dataType = ajaxData.dataType ? ajaxData.dataType : "json";
				ajaxData.data = ajaxData.data ? ajaxData.data : {};
				ajaxData.error = ajaxData.error ? ajaxData.error : (data) => {
					layer.closeAll('loading');
					error(data);
				};
				ajaxData.success = function(data) {
					callback(data);
				};
				$.ajax(ajaxData);
			},

			copy: (obj) => {
				if (typeof obj != 'object') {
					return obj;
				}
				var newobj = {};
				for (var attr in obj) {
					newobj[attr] = $viewEdit.api.copy(obj[attr]);
				}
				return newobj;
			},

			loadJS: (url, callback) => {
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
})(window, $, VE);