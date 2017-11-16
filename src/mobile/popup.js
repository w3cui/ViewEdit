!(function(win, $, $viewEdit) {
	"use strict";
	// 初始化
	var fn = $viewEdit.__proto__;

	var config = {
		time: 1000, // 定时关闭事件			
		content: false, // 内容			
		title: false, // 标题			
		btn: false, // 按钮			
		success: false, // 弹窗成功回调
		shade: true,
		width: 400,
		height: 400,
		// 弹窗成功回调
		success: function() {},
		// 按钮回调
		onBtn: function(type) {}
	};

	var $index = 0;

	fn.popup = {

		// 提示
		msg: function(content) {
			//最常用提示层
			return this.open($.extend({}, config, (function() {
				return typeof content == "object" ? content : {
					content: content
				};
			})()), "msg");
		},

		// 统一弹窗事件
		open: function(deliver, type) {
			type = type || "open";
			var o = new Class(deliver, type);
			return o.index;
		},

		// 加载
		load: function(content) {
			return this.open($.extend({}, config, (function() {
				return typeof content == "object" ? content : {
					content: content
				};
			})()), "load");

		},

		// 关闭
		close: function(index) {
			$("#ve-popup-main" + index).fadeOut(200, function() {
				$(this).remove();
			});
			
		},

		// 全部关闭
		closeAll: function() {},



	};

	/*
	 * 构建通用处理方法  
	 */
	var Class = function(setings, type) {
		var that = this;
		that.index = ++$index;
		that.type = type;
		that.config = $.extend({}, that.config, config, setings);
		document.body ? that.creat() : setTimeout(function() {
			that.creat();
		}, 30);
		$index = that.index;
	};

	Class.pt = Class.prototype;

	//创建骨架
	Class.pt.creat = function() {

		var $this = this;

		// 获取模板
		var template = $($this.template($this.type, $this.config));

		$("body").append(template);

		$("#ve-popup-main" + $this.index).addClass('ve-show');

		switch ($this.type) {
			case "msg":
				setTimeout(function() {
					fn.popup.close($this.index);
				}, $this.config.time);
				break;

			case "open":
				$("#ve-popup-bg" + $this.index + ",#ve-popup-main" + $this.index + " a.ve-close").on("click", function() {
					fn.popup.close($this.index);
				});
				$("#ve-popup-main" + $this.index + " .ve-btn a").on("click", function() {
					$this.config.onBtn($(this).html());
				});

				break;
		}

		// 初始化完毕回调
		$this.config.success(this);

	};

	/*
	 * @type => 模板失败标识
	 * @data => 模板显示数据
	 */
	Class.pt.template = function(type, data) {
		var ret = data.shade ? '<div id="ve-popup-bg' + this.index + '" class="ve-popup-bg"></div>' : '';
		switch (type) {
			case "msg":
				ret = ret + '<div class="ve-msg" style="margin-left:-'+(12*data.content.length+40)/2+'px">' + data.content || "" + '</div>';
				break;
			case "load":
				ret = ret + '<div class="ve-load"></div>';
				break;
			case "open":
				var calculation = this.calculation(data);
				ret = ret + '<div class="ve-open" style="height:' + calculation.height + 'px;width:' + calculation.width + 'px;margin:-' + calculation.top + 'px auto auto -' + calculation.left + 'px;">' +
					'<div class="ve-title"><div class="name">' + data.title + '</div><a class="ve-close"></a></div>' +
					'<div class="ve-center" style="height:' + (calculation.height - 99) + 'px">' + data.content + '</div>' +
					'<div class="ve-btn">' + (function() {
						var btn = data.btn ? "" : "<a class='ve-btn-0'>确定</a>";
						for (var key in data.btn) {
							btn = btn + '<a class="ve-btn-' + key + '">' + data.btn[key] + '</a>'
						}
						return btn;
					})() + '</div>' + '</div>';
				break;
			default:
				ret = ret + '<div class="ve-popup"></div>';
		}
		return "<div id='ve-popup-main"  + this.index + "' style='z-index:90000"+this.index+";' class='ve-popup-main' >" + ret + "</div>";
	};

	/*
	 * 计算高宽坐标
	 * @event => 对象
	 */
	Class.pt.calculation = function(data, event) {
		return {
			left: data.width / 2,
			top: data.height / 2,
			width: data.width,
			height: data.height
		}
	};

	//fn.popup.msg("加载中！");
	//var index = fn.popup.load();
	// fn.popup.open({
	// 	title: "标题",
	// 	content: "",
	// 	btn: ["确定", "取消"],
	// 	width: 1000,
	// 	height: 500,
	// 	onBtn:function(name,index){
	// 		console.log(name);
	// 	}
	// });
})(window, $, window.VE);