//子弹、敌机得的父类
// 子弹、敌机的父类
/*options = {
	width : 1,
	height : 1,
	imgSrc : "",
	x : 1,
	y : 1,
	speed : 1
}*/
function Role(options) {
	options = options || {};
	this.options = options;
	this.element = null;
	this.width = options.width;
	this.height = options.height;
	this.imgSrc = options.imgSrc;
	this.x = options.x;
	this.y = options.y;
	this.speed = options.speed;
	this.isAlive = true; // 当前角色是否还存活
}


Role.prototype = {
	constructor: Role,
	init:function(){
		var _img = this.element = document.createElement("img");
		_img.src = this.imgSrc;
		css(this.element,{
			width:this.width + "px",
			height:this.height + "px",
			position:"absolute",
			top:this.y + "px",
			left:this.x + "px"
		});
		Map.gameContainer.appendChild(_img);
	},
	move:function(){
		var _top = this.y = this.y + this.speed;
		css(this.element,{
			top : _top + "px"
		});
		if(_top > Map.height || _top <0){
			this.destroy();
		}		
	},
	destroy:function(){
		this.element.parentNode.removeChild(this.element);
		this.isAlive = false;
	}
}
