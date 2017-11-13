!(function(win, $, $viewEdit) {
	"use strict";
	// 初始化
	var fn = $viewEdit.__proto__;
	fn.template = function(data, type) {
		switch (type) {

			case "main":
				return '<div class="blockBottom">"当前可编辑区域<span >' + (this.cacheList.length || 0) + '</span>个,是否修改？"</span><a>保存</a><a href="">取消</a>' + data.addBtn + '</div>';
			break;

			case "block":
				return '<div class="block_l blockbk"></div><div class="block_r blockbk"></div><div class="block_t blockbk"></div><div class="block_b blockbk"></div>'; 
			break;

			case "img":
				return '<li imglist = "'+data.index+'"><div>\
						<p class="img"><img src="'+data.src+'" /><a id="file_'+data.index+'" >修改</a></p>\
						<input type="hidden" class="fl" value="'+data.src+'" name="urlsrc" />\
						<label><span><input type="checkbox" name="checkbox" '+data.checkbox+' />是否开启预加载？</span></label>\
						<div class="divupimg" style = "'+data.display+'"><input type="text" placeholder="默认图尺寸" name="urlmin" value="'+data.defobj.minsrc+'" /><input type="text" placeholder="高清图尺寸"  name="urlmax"  value="'+data.defobj.maxsrc+'" /></div>\
						<textarea placeholder="图片alt" class="text" name="alt"  >'+data.alt+'</textarea>\
					</div></li>';
			break;

			default:
				;
		}
		return this;
	};
	// 查找变化后的元素
	fn.contrastList = function() {
		var $this = this;
		var $data = new Array();
		$.each(this.el(), function(index1) {
			var htmltext = $("<div>"+$(this).html().replace(/[\t\r\n]*/g,"").replace(/>[ ]*/g,">").replace(/[ ]*</g,"<")+"</div>");
			$.each(htmltext.find("img"), function(index, val) {
				// 注意此处的修改 容易造成全部数据错乱 
				if($(this).attr("data-original")){
					if($(this).attr("minsrc")){
						$(this).attr("src",$(this).attr("minsrc")).removeAttr('minsrc');
					}else{							
						var url = $("<div>"+$this.cacheList[index1].value+"</div>").find("img:eq("+index+")").attr("src");
						//var min = url.match(/\@(.*)/) ? url.match(/\@(.*)/)[0] : "";
						var min = $this.isOss(url);
						//var tpurl = $(this).attr("data-original").match(/(.*)\@/) ?  $(this).attr("data-original").match(/(.*)\@/)[1] : $(this).attr("data-original") ;
						var tpurl = $this.isSrc($(this).attr("data-original")) ;
						$(this).attr("src",tpurl+min).removeAttr('minsrc')
					}
					
				}
			});

			var valData = {
				"key" : $(this).attr($this.config.el),
				"value" :htmltext.html().replace(/[\t\r\n]*/g,"").replace(/>[ ]*/g,">").replace(/[ ]*</g,"<"),
			};
			$data.push(valData);

		});
		return $data;
	};
	// 绘制编辑区域
	fn.curve = function(_this,prentThis) {
		$(".blockbk").hide();
		var curveobj = this.ergodic().calculationErgodic(_this);
		if($(".blockbk").length == 0){
			$("body").append(this.template({},"block"));
			draw();
		}else{
			draw();
			$(".blockbk").show();
		}
		function draw(){
			$(".block_l").css({
				"height":curveobj.height,
				"left":curveobj.left,
				"top":curveobj.top
			});
			$(".block_t").css({
				"width":curveobj.width,
				"left":curveobj.left,
				"top":curveobj.top
			});
			$(".block_r").css({
				"height":curveobj.height,
				"left":curveobj.left + curveobj.width,
				"top":curveobj.top
			});
			$(".block_b").css({
				"width":curveobj.width,
				"left":curveobj.left,
				"top":curveobj.top + curveobj.height
			});
		}
		
	};

	// 锁定可编辑的区域块
	fn.BlockMoveHtml = function(id, style, type) { //'{width:;height:;top:;left:;}'
		var button = ""
		button += type == "IMG" ? '<a href="javascript:;" class="img" data-block="' + id + '" style=" margin-left:2px; padding:0px 5px; display: inline-block; width:50px; height:25px; line-height:25px;position: relative; top:-25px;right:-1px;  text-align: center; color: #fff;background:#4da1da;">编辑图片</a>\
		<a href="javascript:;" data-block="' + id + '" class="link" style="display: none; margin-left:2px; padding:0px 5px;width:50px; height:25px; line-height:25px;position: relative; top:-25px;right:-1px;  text-align: center; color: #fff;background:#4da1da;">编辑链接</a>' : '';
		button += type == "A" ? '<a href="javascript:;" class="img" data-block="' + id + '" style=" margin-left:2px;display: none; padding:0px 5px; width:50px; height:25px; line-height:25px;position: relative; top:-25px;right:-1px;  text-align: center; color: #fff;background:#4da1da;">编辑图片</a>\
		<a href="javascript:;" data-block="' + id + '" class="link"  style=" margin-left:2px;display: inline-block; width:50px; height:25px; padding:0px 5px; line-height:25px;position: relative; top:-25px;right:-1px;  text-align: center; color: #fff;background:#4da1da;">编辑链接</a>' : '';

		if ($('#Blick' + id).length == 0) {
			return '<div class="Blickcookroom" id="Blick' + id + '" style="' + style + 'position: absolute; font-size:12px; z-index:900;  background:rgba(0,0,0,0.02); text-align: center;">\
				' + button + '\
				</div>';
			//<div class="Blickbg'+id+'" style="position: fixed; z-index:890;left:0px; top:0px; width:100%; height:100%;"></div>';
		} else {
			$('#Blick' + id).attr("style", style + 'position: absolute; z-index:900;background:rgba(0,0,0,0.02);text-align: center; font-size:12px;');
			if (type == "IMG") {
				$('#Blick' + id).find(".img").css("display", "inline-block");
			}
			if (type == "A") {
				$('#Blick' + id).find(".link").css("display", "inline-block");
			}
			return false;
		}

	}

	/*
	*	ergodic();	构造不同类型处理方式
		ergodic.imgErgodic();  图片处理
		ergodic.linkErgodic();  链接处理
		ergodic.textErgodic();  其他处理
		ergodic.calculationErgodic() 计算高宽坐标

	*	ergodicType();	判断可编辑区域内所有编辑对象的类型并且绑定事件
	*/

	// 构造不同类型处理方式	
	fn.ergodic = function() {
		var $this = this;
		var $editType = this.editType();
		return {
			imgErgodic: function(_this, prentThis) {
				var object = this.calculationErgodic(prentThis);
				var imgButton = $this.BlockMoveHtml($(prentThis).attr($this.config.el), "width:" + object.width + "px;height:" + 0 + "px;top:" + object.top + "px;left:" + object.left + "px;", "IMG");
				$("body").append(imgButton);
				if ($(prentThis).is(':hidden')) {
					$("#Blick" + $(prentThis).attr($this.config.el)).hide();
				} else {
					$("#Blick" + $(prentThis).attr($this.config.el)).show();
				}
				$("#Blick" + $(prentThis).attr($this.config.el)).find(".img").unbind('click').click(function() {
					console.log(prentThis);
					$editType.imgTpl(prentThis);
				});
			},
			linkErgodic: function(_this, prentThis) {
				var object = this.calculationErgodic(prentThis);
				var imgButton = $this.BlockMoveHtml($(prentThis).attr($this.config.el), "width:" + object.width + "px;height:" + 0 + "px;top:" + object.top + "px;left:" + object.left + "px;", "A");
				$("body").append(imgButton);
				if ($(prentThis).is(':hidden')) {
					$("#Blick" + $(prentThis).attr($this.config.el)).hide();
				} else {
					$("#Blick" + $(prentThis).attr($this.config.el)).show();
				}
				$("#Blick" + $(prentThis).attr($this.config.el)).find(".link").unbind('click').click(function(event) {
					$editType.linkTpl(prentThis, event);
				});
			},
			textErgodic: function() {},
			calculationErgodic: function(_this) {
				return {
					width: $(_this).width() + parseInt($(_this).css('padding-right')) + parseInt($(_this).css('padding-left')) + (parseInt($('div').css('borderTopWidth')) || 0 ) * 2,
					height: $(_this).height() + parseInt($(_this).css('padding-top')) + parseInt($(_this).css('padding-bottom')) + (parseInt($('div').css('borderTopWidth')) || 0 ) * 2,
					top: $(_this).offset().top - (parseInt($('div').css('borderTopWidth')) || 0 ) * 2,
					left: $(_this).offset().left - (parseInt($('div').css('borderTopWidth')) || 0 ) * 2
				};
			}
		};
	};

	// 判断可编辑区域内所有编辑对象的类型并且绑定事件
	fn.ergodicType = function(_this) {
		var $this = this,
			$ergodicType = this.ergodic();

		$.each($(_this).find("*"), function() {
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
})(window, $, VE);