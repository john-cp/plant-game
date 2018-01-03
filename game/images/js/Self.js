//创建自己的飞机
var Self = {
	width:66,
	height:80,
	x:100,
	y:100,
	imgSrc:"images/self.gif",
	element:null,
	init:function(){//创建战机元素并添加到窗口中
		var _img = this.element = document.createElement("img");
		_img.src = this.imgSrc;
		css(_img,{
			width:this.width+"px",
			height:this.height+"px",
			position:"absolute",
			left:this.x+"px",
			top:this.y+"px"
		})
		Map.gameContainer.appendChild(_img);
	},
	move:function(){
		var that = this;
		Map.gameContainer.onmousemove = function(e){
			e = e || event;
			offset(that.element){
				top:page(e).Y-that.height/2,
				left:page(e).X-that.width/2				
			}
			that.y = that.element.offsetTop;
			THAT.x = that.element.offsetLeft;
		}
	}
	
	
}
