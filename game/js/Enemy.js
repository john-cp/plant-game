function Enemy(options) {
	options = options || {};
	Role.call(this, options);
}

Enemy.prototype = new Role();