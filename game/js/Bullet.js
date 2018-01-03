function Bullet(options){
	var options = {
		width : 6,
		height : 14,
		imgSrc : "images/bullet.png",
		x : 1,
		y : 1,
		speed : -1
	};
	Role.call(this, options);
}

// 继承方法
Bullet.prototype = new Role();
