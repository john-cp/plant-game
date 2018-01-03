//游戏界面
var Game ={
	bullets:[],
	enemys:[],
	init:function(){
		//初始化战机
		Self.init();
		//绑定移动
		Self.move();
	},
	startGame:function(){
		var that = this;
		Map.startElement.onclick=function(){
			hide(this);
			that.init();
			that.autoCreate();
		}
	
	}
}
