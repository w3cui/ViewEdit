!(function(win, $, $viewEdit) {
	"use strict";
	// 初始化
	var fn = $viewEdit.__proto__;
	
	fn.resize = function() {
		var $this = this;
		var $config = $viewEdit.config();

		$("body").append(this.template({
			addBtn: $config.btn
		}, "main"));

		if (this.cacheList().length == 0) return false;
		this.elockOff();

		// 添加传窗体变化是动态开启插件
		$(window).resize(function(){
			$this.elockOff();
		});

		// 性能优化 检查显示的元素调用编辑按钮
		var datahiden = new Array();
		$.each(this.el(), function(index) {
			if ($(this).is(":hidden")) {
				datahiden.push($(this).attr($config.el));
			}
		});
		setInterval(function() {
			$.each($("*[" + $config.el + "]:hidden"), function(index, val) {
				if ($(this).attr($config.el) != datahiden[index]) {
					$this.elockOff();
					datahiden = new Array();
					$.each($this.el(), function(index) {
						if ($(this).is(":hidden")) {
							datahiden.push($(this).attr($config.el));
						}
					});
					return false;
				}
			});
		}, 1000);

		return this;
	};
	// 取消编辑
	fn.elockNo = function() {};

	// 启动编辑
	fn.elockOff = function() {
		var $this = this;
		var $config = $viewEdit.config();

		// 获取
		$.each(this.el(), function(index, val) {
			$this.ergodicType(this);
		});

		$(".blockBottom").find("a").unbind('click').on("click", function() {
			if ($(this).text() == "保存") {
				var index = $viewEdit.layer.load(0, {
					shade: [0.1, '#fff']
				});
				if ($this.contrastList().length == 0) {
					$viewEdit.layer.msg('请修改后再提交', {
						icon: 7
					});
					return false;
				}
				$this.api.ajax({
						type: "POST",
						url: $config.serverUrl,
						data: $.extend($config.formData, {
							"data": $this.contrastList()
						}),
						dataType: "json"
				},function(data) {
					
					$viewEdit.layer.close(index);

					if(fn.onSavedataSucces){
						fn.onSavedataSucces(0,data);
						return;
					}			

					if (data.status == 200 || data.code == 0) {
						$viewEdit.layer.msg("保存成功！", {
							icon: 7
						});
					} else {
						$viewEdit.layer.msg(data.msg, {
							icon: 7
						});
					}

				},function(data){
					if(fn.onSavedataSucces){
						fn.onSavedataSucces(data.status,data);
						return;
					}						
					$viewEdit.layer.msg("链接服务器失败！", {
						icon: 7
					});
					
				});
			}
		});

		this.el().find("a").unbind('click').click(function() {
			return false;
		});

		var timedbclick = 0,
			dbfor = false;

		this.el().find("*").unbind('dbclick').dblclick(function() {
			var _this = this;
			if ($(this)[0].tagName == "IMG") return false;
			var set = setInterval(function() {
				if (timedbclick > 2) {
					timedbclick = 0;
					dbfor = false;
					clearInterval(set);
				}
				timedbclick++;
			}, 1000);
			if (dbfor) {
				return false;
			}
			dbfor = true;
			$(_this).attr("contentEditable", "true");

			$(this).focus().blur(function() {
				// clearInterval(set2);
				$this.el().find("*").removeAttr('contentEditable');
			});
		}).unbind('hover').hover(function() {
			$this.curve($(this).parents("*[" + $config.el + "]"), $(this).parents("*[" + $config.el + "]"));
		}, function() {
			$(".blockbk").hide();
		});
	};



})(window, $, window.VE);