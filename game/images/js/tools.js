// 根据传递的选择器查找对应的元素
// 参数：
//		selector: 选择器，字符串，可以取 #id 、.className、tagName
//		context: 可选参数，表示元素查找的上下文环境，默认为 document
// 返回值：
//		根据对应选择器查找到的元素
function $(selector, context) {
	// 当未传递 context 参数时，使用 document 作为默认值
	context = context || document;

	if ( selector.indexOf("#") === 0 ) // id
		return document.getElementById(selector.slice(1));
	if ( selector.indexOf(".") === 0 ) // class，调用解决兼容问题的方法
		return getElementsByClassName(selector.slice(1), context);
	// element
	return context.getElementsByTagName(selector);
}

// 解决 getElementsByClassName() 兼容问题的函数
// 参数：
//		className: 类名
//		context: (可选参数)查询上下文环境
// 返回值：
//		返回满足条件的所有元素
function getElementsByClassName(className, context) {
	context = context || document;
	/* 支持使用 */
	if (context.getElementsByClassName)
		return context.getElementsByClassName(className);
	/* 不支持使用，则遍历所有元素查找 */
	// 存放所有查找到的元素的数组
	var result = [];
	// 先查找出上下文环境中所有后代元素
	var elements = context.getElementsByTagName("*");
	// 循环遍历查找到的每个元素
	for ( var i = 0, len = elements.length; i < len; i++ ) {
		// 获取当前遍历到元素的所有类名
		var classNames = elements[i].className.split(" ");
		// 判断在所有类名中是否存在函数参数className所表示的元素
		if (inArray(className, classNames) !== -1)  // 存在
			result.push(elements[i]); // 将当前遍历到元素添加到结果数组中
	}

	// 最后返回查找的结果
	return result;
}

// 查找 value 在 array 数组中第一次出现的位置
// 解决 array.indexOf() 兼容问题
// 参数：
//		array : 数组
//		value : 待查找的值
// 返回值：
//		value在array中的元素位置，找不到，返回-1
function inArray(value, array) {
	if (Array.prototype.indexOf)  // 表示浏览器支持使用 indexOf() 方法
		return array.indexOf(value);

	// 不支持使用 indexOf() 方法
	for (var i = 0, len = array.length; i < len; i++) {
		if (array[i] === value)
			return i;
	}
	return -1;
}

// 获取/设置指定元素某个CSS属性值
// 该方法可以使用三种调用方式：
//		a. css(element, "width") -- 获取指定element元素的 width 属性值
//		b. css(element, "width", "100px") -- 设置元素的width为100px
//		c. css(elmenet, {width:"100px", height:"200px"}) -- 设置元素的多个CSS属性值，通过第二个参数（对象）来表示各CSS属性
// 参数：
//		element: DOM元素对象
//		attr: CSS属性名
//		value: 设置的属性值
// 返回值：
//		CSS属性值
function css(element, attr, value) {
	if (typeof attr === "string" && typeof value === "undefined") {
		// 获取 css 样式
		return window.getComputedStyle 
				? getComputedStyle(element)[attr] 
				: element.currentStyle[attr];		
	} else if(typeof attr === "string") {
		element.style[attr] = value;
	} else if(typeof attr === "object") {
		for (var prop in attr) {
			element.style[prop] = attr[prop];
		}
	}
}
/*function css(element, attr) {
	return window.getComputedStyle 
			? getComputedStyle(element)[attr] 
			: element.currentStyle[attr];
}*/

// 显示指定的元素
function show(element) {
	css(element, "display", "block");
}

// 隐藏指定的元素
function hide(element) {
	css(element, "display", "none");
}

// 注册事件监听
// 参数：
//		element: 待注册事件监听的元素
//		type: 事件类型字符串
//		callback: 事件处理程序（函数）
function on(element, type, callback) {
	if (element.addEventListener){ // 支持使用 addEventListener
		if (type.indexOf("on") === 0)
			type = type.slice(2);
		element.addEventListener(type, callback, false);
	} else { // 不支持使用 addEventListener
		if (type.indexOf("on") !== 0)
			type = "on" + type;
		element.attachEvent(type, callback);
	}
}

// 事件委派，将后代元素的事件委派给祖先元素处理
// 参数：
//		element: 祖先元素
//		selector: 后代元素选择器，暂支持类、元素选择器
//		type: 事件类型
//		callback: 事件函数
function delegate(element, selector, type, callback) {
	// 处理事件的事件函数
	function cb(e) {
		e = e || event;
		// 解决兼容问题
		e.target = e.target || e.srcElement;
		e.pageX = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
		e.pageY = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
		stopPropagation = e.stopPropagation;
		e.stopPropagation = function(){
			stopPropagation ? stopPropagation() : e.cancelBubble = true;
		}
		preventDefault = e.preventDefault;
		e.preventDefault = function(){
			preventDefault ? preventDefault() : e.returnValue = false;
		}
		// 获取事件源
		var src = e.target;
		// 判断，后代元素的条件
		if (src !== element) {
			if (selector.indexOf(".") === 0) { // 类选择器
				if(new RegExp("\\b"+selector.slice(1)+"\\b").test(src.className)) {
					var newCb = callback.bind(src);
					newCb(e);
				}
			} else { // 元素选择器
				if (src.nodeName.toUpperCase() === selector.toUpperCase()){
					var newCb = callback.bind(src);
					newCb(e);
				}
			}
		}
	}

	if (element.addEventListener){ // 支持使用 addEventListener
		if (type.indexOf("on") === 0)
			type = type.slice(2);
		element.addEventListener(type, cb, false);
	} else { // 不支持使用 addEventListener
		if (type.indexOf("on") !== 0)
			type = "on" + type;
		element.attachEvent(type, cb);
	}
}

// 移除事件监听
// 参数：
//		element: 待移除事件监听的元素
//		type: 事件类型字符串
//		callback: 事件处理程序（函数）
function off(element, type, callback) {
	if (element.removeEventListener){ // 支持使用 removeEventListener
		if (type.indexOf("on") === 0)
			type = type.slice(2);
		element.removeEventListener(type, callback, false);
	} else { // 不支持使用 removeEventListener
		if (type.indexOf("on") !== 0)
			type = "on" + type;
		element.detachEvent(type, callback);
	}
}

// 获取/设置指定元素在文档中的坐标定位
// 参数：
//		element: 待求解坐标的元素
//		coordinates: 待设置的元素在文档中的坐标
// 返回值: 
//		元素在文档中定位坐标对象，有 top 与 left 两个属性
function offset(element, coordinates) {
	if (typeof coordinates === "undefined") {
		var _top = 0, _left = 0;
		while (element !== null) {
			_top += element.offsetTop;
			_left += element.offsetLeft;
			element = element.offsetParent;
		}
		return {
			top : _top,
			left : _left
		};
	}
	
	/* 设置在文档中的坐标 */
	// 求父元素在文档中的坐标
	var _top = 0, _left = 0;
	var parent = element.offsetParent;
	while (parent !== null) {
		_top += parent.offsetTop;
		_left += parent.offsetLeft;
		parent = parent.offsetParent;
	}
	// 求在父元素坐标系中的坐标位置
	_top = coordinates.top - _top;
	_left = coordinates.left - _left;
	// 重新设置
	css(element, {
		top : _top + "px",
		left : _left + "px"
	});
}

// 解决 event.pageX、event.pageY 兼容问题
function page(event) {
	var x = event.pageX 
			? event.pageX
			: event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y = event.pageY 
			? event.pageY
			: event.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
	return {
		x : x,
		y : y
	}
}

// 获取/设置cookie
// 参数：
//		key : cookie名
//		value: cookie值
//		options：配置 {expires:, path:, domain:, secure:}
function cookie(key, value, options) {
	// writing
	if (typeof value !== "undefined") {	// 有传递 value 则保存cookie
		options = options || {};
		// 构建 cookie 字符串
		var _cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		// 判断是否有可选参数的设置
		if (options.expires) { // 有设置失效时间
			var date = new Date();
			date.setDate(date.getDate() + options.expires);
			_cookie += ";expires=" + date.toUTCString();
		}
		if (options.path) // 有设置路径
			_cookie += ";path=" + options.path;
		if (options.domain) // 有设置域
			_cookie += ";domain=" + options.domain;
		if (options.secure) // 有设置链接条件
			_cookie += ";secure";

		// 保存
		return document.cookie = _cookie;
	}

	// reading
	// 获取所有的 cookie
	var cookies = document.cookie.split("; ")
	// 遍历每条cookie，判断是否当前要找的 cookie 内容
	for (var i = 0, len = cookies.length; i < len; i++) {
		// 将当前遍历到的 key=value 内容以 = 分割
		var parts = cookies[i].split("=");
		// 数组中第一个元素为 cookie 名
		var name = decodeURIComponent(parts.shift());
		// 判断当前cookie名是否为要查找的cookie名称
		if (name === key)
			return decodeURIComponent(parts.join("=")); // 返回 cookie 值
	}
	// 如果不存在查找的 cookie
	return undefined;
}

// 删除cookie
function removeCookie(key, options) {
	options = options || {};
	options.expires = -1;
	cookie(key, "", options);
}

// 运动框架：线性运动
// 参数：
//		element: 待添加运动动画效果的元素
//		options: 多属性运动目标终值对象
//		speed: 运动总时间
//		fn: 运动结束后要继续执行的函数
function animate(element, options, speed, fn) {
	// 先停止元素上已有运动动画效果
	clearInterval(element.timer);
	// 获取多属性的初始值
	var start = {};
	for (var attr in options) {
		if (attr === "scrollTop")
			start.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		else
			start[attr] = parseFloat(css(element, attr));
	}
	// 记录启动计时器的时间
	var startTime = +new Date();
	// 启动计时器，实现运动动画效果
	element.timer = setInterval(function(){
		// 计算已经运动经过的时长
		var diff = Math.min(+new Date() - startTime, speed);
		// 计算各属性当前次运动计算结果
		for (var attr in options) {
			// 根据公式计算
			var result = diff * (options[attr] - start[attr]) / speed + start[attr];
			// 设置CSS样式
			if (attr === "scrollTop") {
				document.documentElement.scrollTop = document.body.scrollTop = result;
			} else {
				element.style[attr] = result + (attr == "opacity" ? "" : "px");
				if (attr == "opacity") // IE9前
					element.style.filter = "alpha(opacity="+ (result * 100) +")";				
			}
		}
		// 判断是否停止计时器
		if (diff === speed) {
			clearInterval(element.timer);
			// 如果有运动结束继续执行的函数，则调用执行
			fn && fn();
		}
	}, 1000/60);
}

// 淡入
function fadeIn(element, speed, fn) {
	show(element);
	element.style.opacity = 0;
	animate(element, {opacity:1}, speed, fn);
}

// 淡出
function fadeOut(element, speed, fn) {
	animate(element, {opacity:0}, speed, function(){
		hide(element);
		element.style.opacity = 1;
		fn && fn();
	});
}

// 获取边框以内宽度
function innerWidth(element){
	if (css(element, "display") != "none") // 有显示元素
		return element.clientWidth;
	// 元素隐藏
	return parseFloat(css(element, "width"))
			+ parseFloat(css(element, "paddingLeft"))
			+ parseFloat(css(element, "paddingRight"));
}

// 获取边框及以内总宽度
function outerWidth(element){
	if (css(element, "display") != "none") // 有显示元素
		return element.offsetWidth;
	// 元素隐藏
	return parseFloat(css(element, "width"))
			+ parseFloat(css(element, "paddingLeft"))
			+ parseFloat(css(element, "paddingRight"))
			+ parseFloat(css(element, "borderLeftWidth"))
			+ parseFloat(css(element, "borderRightWidth"));
}

// 获取边框以内高度
function innerHeight(element){
	if (css(element, "display") != "none") // 有显示元素
		return element.clientHeight;
	// 元素隐藏
	return parseFloat(css(element, "height"))
			+ parseFloat(css(element, "paddingTop"))
			+ parseFloat(css(element, "paddingBottom"));
}

// 获取边框及以内总高度
function outerHeight(element){
	if (css(element, "display") != "none") // 有显示元素
		return element.offsetHeight;
	// 元素隐藏
	return parseFloat(css(element, "height"))
			+ parseFloat(css(element, "paddingTop"))
			+ parseFloat(css(element, "paddingBottom"))
			+ parseFloat(css(element, "borderTopWidth"))
			+ parseFloat(css(element, "borderBottomWidth"));
}

// ajax操作
/*options = {
	type : "get|post", // 请求方式，默认 "get"
	url : "xxx.php", // 请求资源的URL
	async : true, // 是否异步请求，默认为 true
	data : {}, // 向服务器传递的数据{username:"xiaoming", password:"abc", phone:"123"}	
	dataType : "text|json", // 预期从服务器返回的数据格式
	success : function(data){},  // 请求成功执行的函数
	error : function(errMsg){} // 请求失败执行的函数
}*/
function ajax(options) {
	if (!options) // 未传递参数，结束函数执行
		return;

	// 获取请求的URL
	var url = options.url;
	if (!url) // 没有请求的服务器资源，结束函数执行
		return;

	// 获取请求方式
	var method = options.type || "get";

	// 是否异步
	var async = options.async;
	if (async === undefined)
		async = true;

	// 处理查询字符串
	var queryString = null;
	if (options.data) { // 有向服务器传递的数据，则连接查询字符串
		queryString = [];
		for (var attr in options.data) {
			queryString.push(attr + "=" + options.data[attr]);
		}
		queryString = queryString.join("&");
	}

	// 如果是 get 提交数据，将数据用 ? 号串联在 url 中
	if (method === "get" && queryString) {
		url += "?" + queryString;
		queryString = null;
	}

	// 创建核心对象
	var xhr;
	if (window.XMLHttpRequest)
		xhr = new XMLHttpRequest();
	else
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	// 建立连接
	xhr.open(method, url, async);
	// 如果要像表单一样POST提交数据，则设置请求头
	if (method === "post") 
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	
	// 发送请求
	xhr.send(queryString);
	if (async) { // 异步		
		// 处理响应
		xhr.onreadystatechange = function(){
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					// 获取响应文本
					var data = xhr.responseText;
					// 判断预期返回的数据格式
					if (options.dataType === "json") 
						data = JSON.parse(data);
					// 请求成功时数据处理业务
					options.success && options.success(data);
				} else {
					// 请求失败处理情况
					options.error && options.error(xhr.statusText);
				}
			}
		}
	} else { // 同步
		if (xhr.status === 200) {
			// 获取响应文本
			var data = xhr.responseText;
			// 判断预期返回的数据格式
			if (options.dataType === "json") 
				data = JSON.parse(data);
			// 请求成功时数据处理业务
			options.success && options.success(data);
		} else {
			// 请求失败处理情况
			options.error && options.error(xhr.statusText);
		}
	}
}

// 用于处理get请求
function get(url, data, success, dataType) {
	ajax({
		type : "get",
		url : url,
		data : data,
		dataType : dataType,
		success : success
	});
}

// 用于处理post请求
function post(url, data, success, dataType) {
	ajax({
		type : "post",
		url : url,
		data : data,
		dataType : dataType,
		success : success
	});
}

// 用于处理get请求，响应数据的格式为json格式
function getJSON(url, data, success) {
	ajax({
		type : "get",
		url : url,
		data : data,
		dataType : "json",
		success : success
	});
}