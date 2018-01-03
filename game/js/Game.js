//游戏界面
var Game ={
	bullets:[],
	enemies:[],
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
	
	},
	autoCreate : function(){ 
		var count = 0;
		setInterval(() => {
			count++;

			if (count % 30 == 0) { // 自动创建子弹
				// 创建子弹
				var bullet = new Bullet();
				// 子弹产生时的坐标
				bullet.x = Self.x + Self.width / 2;
				bullet.y = Self.y - bullet.options.height;
				// 子弹初始化
				bullet.init();
				// 将当前创建的子弹添加到所有子弹的数组中
				this.bullets.push(bullet);
			}

			// 自动创建小敌机
			if (count % 90 === 0) {
				var enemy = new Enemy({
					width : 34,
					height : 24,
					imgSrc : "images/small_fly.png",
					y : 1,
					speed : 1
				});
				enemy.x = Math.floor(Math.random() * Map.width);
				enemy.init();
				this.enemies.push(enemy);
			}

			// 让每颗子弹向前走一步
			for (var i = this.bullets.length - 1; i >= 0; i--) {
				this.bullets[i].move();
				if (!this.bullets[i].isAlive)
					this.bullets.splice(i, 1);
			}

			// 让每架敌机向前走一步
			for (var i = this.enemies.length - 1; i >= 0; i--) {
				this.enemies[i].move();
				if (!this.enemies[i].isAlive)
					this.enemies.splice(i, 1);
			}

			// 碰撞检测
			for (var i = this.bullets.length - 1; i >= 0; i--) {
				var bullet = this.bullets[i];
				for (var j = this.enemies.length - 1; j >= 0; j--) {
					var enemy = this.enemies[j];
					// 判断 bullet所表示的子弹与 enemey所表示的敌机是否碰撞
					if (this.intersect(bullet, enemy)) {
						bullet.destroy();
						enemy.destroy();
						this.bullets.splice(i, 1);
						this.enemies.splice(j, 1);
						break;
					}
				}
			}
		}, 1000 / 60);
	},
	intersect : function(obj1, obj2) { // 碰撞检测  true:碰撞 false:未碰撞
		return !(obj2.y > obj1.y + obj1.height
				|| obj1.y > obj2.y + obj2.height
				|| obj2.x > obj1.x + obj1.width
				|| obj1.x > obj2.x + obj2.width);
	}
}
