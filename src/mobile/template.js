!(function(win, $, $viewEdit) {
	"use strict";
	var fn = $viewEdit.__proto__;
	fn.template = function(data, type) {
		switch (type) {

			case "main":
				return '<div class="blockBottom">"当前可编辑区域<span >' + (this.cacheList().length || 0) + '</span>个,是否修改？"</span><a>保存</a>' + data.addBtn + '</div>';
				break;

			case "block":
				return '<div class="block_l blockbk"></div><div class="block_r blockbk"></div><div class="block_t blockbk"></div><div class="block_b blockbk"></div><div class="block_main blockbk">新增模板</div>';
				break;

			case "img":
				return '<li imglist = "' + data.index + '"><div>\
						<p class="img"><img src="' + data.src + '" /><a id="file_' + data.index + '" >修改</a></p>\
						<input type="hidden" class="fl" value="' + data.src + '" name="urlsrc" />\
						<label><span><input type="checkbox" name="checkbox" ' + data.checkbox + ' />是否开启预加载？</span></label>\
						<div class="divupimg" style = "' + data.display + '"><input type="text" placeholder="默认图尺寸" name="urlmin" value="' + data.defobj.minsrc + '" /><input type="text" placeholder="高清图尺寸"  name="urlmax"  value="' + data.defobj.maxsrc + '" /></div>\
						<textarea placeholder="图片alt" class="text" name="alt"  >' + data.alt + '</textarea>\
					</div></li>';
				break;

			case "link":
				return '<li imglist = "' + data.index + '"><div>\
						<p class="img" id="boxdivlist' + data.index + '" ><span style="font-size: 30px;"  >Link</span></p>\
						<input type="text" name="href" placeholder="链接地址" value="' + data.href + '"  />\
						<textarea placeholder="Title信息" class="text" name="title"  >' + data.title + '</textarea>\
					</div></li>';
				break;
			default:
				;
		}
		return this;
	};

	/*
	 *	@设置延迟加载修改初始数据
	 *	@key =>>$t  @data =>> 小图于大图尺寸  @ulr  =>> 更新图片地址  @index =>> 图片的index
	 */
	fn.cacheListUp = function($key, $data, $url, $index) {
		var $this = this;
		$.each(this.cacheList(), function(index, val) {
			if ($key == this.key) {
				var _this = $("<div>" + this.value + "</div>");
				$.each(_this.find("img"), function(index, val) {
					if (index == $index) {
						if ($data.minsrc != "") {

							var host = $this.isSrc($url) == "" ? $url : $this.isSrc($url);
							$(this).attr("src", host + $data.minsrc);
						}
						$(this).attr("data-original", host + $data.maxsrc)
					}
				});

				this.value = _this.html();
			}
		});
	};

	// 查找变化后的元素
	fn.contrastList = function() {

		var $config = $viewEdit.config();
		var $this = this;
		var $data = new Array();
		$.each(this.el(), function(index1) {
			var htmltext = $("<div>" + $(this).html().replace(/[\t\r\n]*/g, "").replace(/>[ ]*/g, ">").replace(/[ ]*</g, "<") + "</div>");
			$.each(htmltext.find("img"), function(index, val) {
				// 注意此处的修改 容易造成全部数据错乱 
				if ($(this).attr("data-original")) {
					if ($(this).attr("minsrc")) {
						$(this).attr("src", $(this).attr("minsrc")).removeAttr('minsrc');
					} else {
						var url = $("<div>" + $this.cacheList()[index1].value + "</div>").find("img:eq(" + index + ")").attr("src");
						var min = $this.isOss(url);
						var tpurl = $this.isSrc($(this).attr("data-original"));
						$(this).attr("src", tpurl + min).removeAttr('minsrc')
					}

				}
			});

			var valData = {
				"key": $(this).attr($config.el),
				"value": htmltext.html().replace(/[\t\r\n]*/g, "").replace(/>[ ]*/g, ">").replace(/[ ]*</g, "<"),
			};
			$data.push(valData);

		});
		return $data;
	};

	// 绘制编辑区域
	fn.curve = function(_this, prentThis,isTpl) {
		$(".blockbk").hide();
		var curveobj = this.ergodic().calculationErgodic(_this);

		if ($(".blockbk").length == 0) {
			$("body").append(this.template({}, "block"));
			draw();
		} else {
			draw();
			$(".blockbk").show();
			if(!isTpl){
				$(".block_main").hide();
			}
		}

		function draw() {

			if(isTpl){
				$(".block_main").css({
					"height": curveobj.height,
					"left": curveobj.left,
					"top": curveobj.top,
					"width": curveobj.width,
					"display" : "block",
					"line-height": curveobj.height +"px"
				});
			}

			$(".block_l").css({
				"height": curveobj.height,
				"left": curveobj.left,
				"top": curveobj.top
			});
			$(".block_t").css({
				"width": curveobj.width,
				"left": curveobj.left,
				"top": curveobj.top
			});
			$(".block_r").css({
				"height": curveobj.height,
				"left": curveobj.left + curveobj.width,
				"top": curveobj.top
			});
			$(".block_b").css({
				"width": curveobj.width,
				"left": curveobj.left,
				"top": curveobj.top + curveobj.height
			});
		}

	};

	// 锁定可编辑的区域块
	fn.BlockMoveHtml = function(id, style, type) { //'{width:;height:;top:;left:;}'
		var button = ""
		button += '<a href="javascript:;" class="img" data-block="' + id + '" >编辑图片</a>'+
		'<a href="javascript:;" data-block="' + id + '" class="link" >编辑链接</a>' +
		'<a href="javascript:;" data-block="' + id + '" class="addtpl" >新增</a>' ;
		var imgButton = "";
		if ($('#Blick' + id).length == 0) {
			imgButton = '<div class="Blickcookroom" id="Blick' + id + '" style="' + style + 'position: absolute; font-size:12px; z-index:900;  background:rgba(0,0,0,0.02); text-align: center;">\
				' + button + '\
				</div>';
			$("body").append(imgButton);
		} else {
			$('#Blick' + id).attr("style", style + '');
		}

		if (type == "IMG") {
			$('#Blick' + id).find(".img").css("display", "inline-block");
		}
		if (type == "A") {
			$('#Blick' + id).find(".link").css("display", "inline-block");
		}
		if (type == "tpl") {
			$('#Blick' + id).find(".addtpl").css("display", "inline-block");
		}

	}

	/*
	 *	ergodic();	构造不同类型处理方式
	 *	ergodic.imgErgodic();  图片处理
	 *	ergodic.linkErgodic();  链接处理
	 *	ergodic.textErgodic();  其他处理
	 *	ergodic.calculationErgodic() 计算高宽坐标
	 *	ergodicType();	判断可编辑区域内所有编辑对象的类型并且绑定事件
	*/

	// 构造不同类型处理方式	
	fn.ergodic = function() {
		var $config = $viewEdit.config();
		var $this = this;
		var $editType = this.editType();
		return {

			// 图片处理
			imgErgodic: function(_this, prentThis) {
				var object = this.calculationErgodic(prentThis);
				$this.BlockMoveHtml($(prentThis).attr($config.el), "width:" + object.width + "px;height:" + 0 + "px;top:" + object.top + "px;left:" + object.left + "px;", "IMG");
				
				if ($(prentThis).is(':hidden')) {
					$("#Blick" + $(prentThis).attr($config.el)).hide();
				} else {
					$("#Blick" + $(prentThis).attr($config.el)).show();
				}
				$("#Blick" + $(prentThis).attr($config.el)).find(".img").unbind('click').click(function() {
					$editType.imgTpl(prentThis);
				});
			},

			// 链接处理
			linkErgodic: function(_this, prentThis) {
				var object = this.calculationErgodic(prentThis);
				$this.BlockMoveHtml($(prentThis).attr($config.el), "width:" + object.width + "px;height:" + 0 + "px;top:" + object.top + "px;left:" + object.left + "px;", "A");
				
				if ($(prentThis).is(':hidden')) {
					$("#Blick" + $(prentThis).attr($config.el)).hide();
				} else {
					$("#Blick" + $(prentThis).attr($config.el)).show();
				}
				$("#Blick" + $(prentThis).attr($config.el)).find(".link").unbind('click').click(function(event) {
					$editType.linkTpl(prentThis, event);
				});
			},

			// 新增加模块
			addTplErgodic : function(_this, prentThis){
				var object = this.calculationErgodic(_this);
				$this.BlockMoveHtml($(prentThis).attr($config.el), "width:" + object.width + "px;height:" + 0 + "px;top:" + object.top + "px;left:" + object.left + "px;", "tpl");
				if ($(prentThis).is(':hidden')) {
					$("#Blick" + $(prentThis).attr($config.el)).hide();
				} else {
					$("#Blick" + $(prentThis).attr($config.el)).show();
				}
				$("#Blick" + $(prentThis).attr($config.el)).find(".addtpl").unbind('click').click(function() {
					$editType.addTpl(prentThis,_this);
				}).unbind('hover').hover(function(event) {
					$this.curve($(_this), $(_this),true);
				},function(){
					$(".blockbk").hide();
				});
			},

			// 默认处理
			textErgodic :function(){

			},

			// 计算坐标
			calculationErgodic: function(_this) {
				return {
					width: $(_this).width() + parseInt($(_this).css('padding-right')) + parseInt($(_this).css('padding-left')) + (parseInt($('div').css('borderTopWidth')) || 0) * 2,
					height: $(_this).height() + parseInt($(_this).css('padding-top')) + parseInt($(_this).css('padding-bottom')) + (parseInt($('div').css('borderTopWidth')) || 0) * 2,
					top: $(_this).offset().top - (parseInt($('div').css('borderTopWidth')) || 0) * 2,
					left: $(_this).offset().left - (parseInt($('div').css('borderTopWidth')) || 0) * 2
				};
			}
		};
	}; 

	// 判断可编辑区域内所有编辑对象的类型并且绑定事件
	fn.ergodicType = function(_this) {
		var $config = $viewEdit.config();
		var $this = this,
			$ergodicType = this.ergodic();
		$.each($(_this).find("*"), function() {

			// 添加自定义模块
			if(typeof $(this).attr($config.addTemplate) != "undefined"){
				$ergodicType.addTplErgodic(this, _this);
			}

			switch (this.tagName) {
				case "IMG": //图片编辑
					$ergodicType.imgErgodic(this, _this);
					break;
				case "A": //a标签编辑
					$ergodicType.linkErgodic(this, _this);
					break;
				default: //其他
					$ergodicType.textErgodic();
			}
		});
		return this;
	};

})(window, $, window.VE);