!(function(win, $, $viewEdit) {
	"use strict";
	// 初始化
	var fn = $viewEdit.__proto__;	
	fn.editType = function() {
		var $config = $viewEdit.config();
		var $this = this;
		return {

			// 图片编辑
			imgTpl: function(prentThis) {

				var imglist = new Array();
				var defhtmltext = $("<div></div>"),
					defobj = new Array();

				$.each($this.cacheList(), function(index, val) {
					if (this.key == $(prentThis).attr($config.el)) {
						defhtmltext = $("<div>" + this.value + "</div>");
					}
				});

				$.each(defhtmltext.find("img"), function(index, val) {
					var minsrc = $this.isOss($(this).attr("src"));
					if ($(this).attr("data-original")) {
						var maxsrc = $this.isOss($(this).attr("data-original"));
					} else {
						var maxsrc = "";
					}

					defobj.push({
						"minsrc": minsrc,
						"maxsrc": maxsrc
					});
				});

				$.each($(prentThis).find("img"), function(index) {
					var src = $(this).attr("data-original") ? $(this).attr("data-original") : $(this).attr("src");
					src = $this.isSrc(src);
					var checkbox = $(this).attr("data-original") ? 'checked="checked"' : "";
					var display = $(this).attr("data-original") ? 'display:block' : "display:none";

					var tplList = $this.template({
						"index": index,
						"src": src,
						"checkbox": checkbox,
						"display": display,
						"defobj": defobj[index],
						"alt": $(this).attr("alt")
					}, "img");

					imglist.push(tplList);
				});

				var index = $this.popup.open({
					title: "编辑图片",
					content: '<ul class="blockimglist"></ul>',
					area: ["", "600px"],
					width:1000,
					height:600,
					type: 1,
					btn: ['保存', '取消'], //按钮
					onBtn: function(type, layero) {
						var msgthis = true;
						if(type != "保存"){ 
							$this.popup.close(index);
							return false;
						}
						$.each($(".blockimglist li"), function(index, val) {
							var srcObject = {
								urlsrc: $(this).find("input[name='urlsrc']"),
								minsrc: $(this).find("input[name='urlmin']"),
								maxsrc: $(this).find("input[name='urlmax']"),
							};
							if ($(this).find("input[type='checkbox']").is(':checked')) {
								if ((srcObject.minsrc.val()[0] != "@" || srcObject.maxsrc.val()[0] != "@") && (srcObject.minsrc.val()[0] != "?" || srcObject.maxsrc.val()[0] != "?")) {
									$this.popup.msg("请参照“@250h_250w_1e_1c或?x-oss-process=image/resize,w_250,h_250”格式书写图片尺寸！");
									msgthis = false;
									return false;
								}
								$(prentThis).find("img:eq(" + index + ")").attr("data-original", srcObject.urlsrc.val() + srcObject.maxsrc.val());
								$(prentThis).find("img:eq(" + index + ")").attr("minsrc", srcObject.urlsrc.val() + srcObject.minsrc.val());
								$this.cacheListUp($(prentThis).attr("*[" + $config.el + "]"), {
									"minsrc": srcObject.minsrc.val(),
									"maxsrc": srcObject.maxsrc.val()
								}, srcObject.urlsrc.val(), index);
								$(prentThis).find("img:eq(" + index + ")").attr("src", srcObject.urlsrc.val() + srcObject.maxsrc.val());
							} else {
								$(prentThis).find("img:eq(" + index + ")").removeAttr('data-original').removeAttr('minsrc').attr("src", srcObject.urlsrc.val());
							}
							$(prentThis).find("img:eq(" + index + ")").attr("alt", $(this).find("textarea[name='alt']").val());
						});
						if (msgthis) {
							$this.popup.msg('操作成功！');
							$this.popup.close(index);
						}
					},
					success:function(){
						// 载入webuploader
						$(".blockimglist").append(imglist).find("input[type='file']");
						$(".blockimglist input[name='checkbox']").change(function() {
							if ($(this).is(":checked")) {
								$(this).parents("li").find(".divupimg").show();
							} else {
								$(this).parents("li").find(".divupimg").hide();
							}
						});
						// 初始化webuploader
						$.each($(".blockimglist").find("a"), function() {
							$this.webUploader("#" + $(this).attr("id"));
						});
					}
				});


				

			},

			// 链接编辑
			linkTpl: function(prentThis, event) {
				var linklist = new Array();
				$.each($(prentThis).find("a"), function(index) {
					var src = $(this).attr("data-original") ? $(this).attr("data-original") : $(this).attr("src");
					var title = $(this).attr("title") ? $(this).attr("title") : "";
					var divtext = "";
					var soltop = $(document).scrollTop();

					// 生成预览图
					event.preventDefault();
					html2canvas(this, {
						allowTaint: true,
						taintTest: false,
						width: 180,
						height: 150,
						onrendered: function(canvas) {
							canvas.id = "mycanvas" + index;
							$(document).scrollTop(soltop);
							document.getElementById('boxdivlist' + index).appendChild(canvas);
						}
					});

					// 添加内容
					var tplList = $this.template({
						"index": index,
						"title": title,
						"href": $(this).attr("href")
					}, "link");
					linklist.push(tplList);
				});

				var index = $this.popup.open({
					title: "编辑链接",
					content: '<ul class="blockimglist"></ul>',
					width:1000,
					height:600,
					type: 1,
					btn: ['保存', '取消'], 
					onBtn: function(type, layero) {
						if(type != "保存"){ 
							$this.popup.close(index);
							return false;
						}
						$.each($(".blockimglist li"), function(index, val) {						
							$(prentThis).find("a:eq(" + index + ")")
								.attr("href", $(this).find("input[name='href']").val())
								.attr("title", $(this).find("textarea[name='title']").val());
						});
						$this.popup.close(index);
						$this.popup.msg('操作成功！', {
							icon: 1
						});

					},
					success:function(){
						$(".blockimglist").append(linklist);
					}
				});
			},

			// 自定义新增模块
			addTpl: function(prentThis, _this) {
				var appendTpl = $(_this).clone();		
				var _thi = this;
				$(_this).before(appendTpl);
				var ergodic ;
				$(appendTpl).removeAttr($config.addTemplate).hover(function(){
					ergodic = _thi.removeTpl(this);

				},function(event){
					var close = $("#"+ergodic.id).offset();
					var offset = $(this).offset();
					var width = parseInt($("#"+ergodic.id).width());
					var heigth = parseInt($("#"+ergodic.id).height());

				  var relativeX = parseInt(width + close.left);
				  var relativeY = parseInt(heigth + close.top);
				  if(event.pageX >= close.left && event.pageX <= relativeX && 
				  	event.pageY >= close.top && event.pageY <= relativeY ){
						return false;
				  }
				  _thi.removeTpl(this,true);
					
				});
				
				$this.curve($(_this), $(_this), true);
			},

			// 删除模块
			removeTpl:function(evn,or){
				
				var ergodic = $this.ergodic().calculationErgodic($(evn));
				ergodic.id ="ve_remove_"+$(evn).prop("tagName")+$(evn).index();
				if(or){
					$("#"+ergodic.id).remove();
					return;
				}
				$("#"+ergodic.id).remove();

				var tpl = $($this.template(ergodic,"remove"));

				tpl.unbind("click").click(function(){
					$(evn).remove();
					$(this).remove();
				});
				$("body").append(tpl);
				return ergodic;
			}

		};
	}

})(window, $, window.VE);