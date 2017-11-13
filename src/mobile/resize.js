!(function(win, $, $viewEdit) {
	"use strict";
	// 初始化
	var fn = $viewEdit.__proto__;
	fn.resize = function(){
		if(this.cacheList.length == 0 ) return false;
		$("body").append(this.template({addBtn:"<a>新增</a>"},"main"));
		//this.elockOff(this.cacheList);
		this.elockOff();
		return this;
	};
	// 取消编辑
	fn.elockNo = function() {
	};

	// 启动编辑
	fn.elockOff = function() {
		var $this = this;		
		$.each(this.cacheList, function(index, val) {
			$this.ergodicType(this);			
		});
		$(".blockBottom").find("a").on("click",function(){
				if($(this).text() == "保存"){
					var index = $viewEdit.layer.load(0, {shade: [0.1,'#fff'] });
					if($this.contrastList().length == 0){
						$viewEdit.layer.msg('请修改后再提交', {icon: 7});
						return false;
					}
					$this.api.ajax({
						type: "POST",
						url:$this.config.serverUrl,
						data: $.extend($this.config.formData,{"data" : $this.contrastList()}),
						dataType:"json"},
						function(data){							
							$viewEdit.layer.close(index);
							if(data.status == 200 || data.code == 0){
								$viewEdit.layer.msg("保存成功！", {icon: 7});
							}else{
								$viewEdit.layer.msg(data.msg, {icon: 7});
							}
						}
					);
				}
			});

			this.el().find("a").click(function(){
				return false;
			});

			var timedbclick = 0,
				dbfor = false;

			this.el().find("*").unbind('dbclick').dblclick(function(){
				var _this = this;
				if($(this)[0].tagName == "IMG") return false;
				var set = setInterval(function(){
					if(timedbclick>2){
						timedbclick = 0;
						dbfor = false;
						clearInterval(set);
					}
					timedbclick ++;
				},1000);
				if(dbfor){return false;}
				dbfor = true;
				$(_this).attr("contentEditable","true");
				
			$(this).focus().blur(function(){
					// clearInterval(set2);
					$this.el().find("*").removeAttr('contentEditable');		
				});
			}).hover(function(){
				$this.curve($(this).parents("*[" + $this.config.el + "]"),$(this).parents("*[" + $this.config.el + "]"));
			},function(){
				$(".blockbk").hide();
			});
	};

  fn.showInit = function(){

  };
  

})(window, $, VE);