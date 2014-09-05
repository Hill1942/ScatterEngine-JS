(function(win) {
	var sprite = win.Sprite = function() {
		if (typeof this.init != "function") {
			sprite.prototype.init = function() {

			}
		}
		if (typeof this.xTo != "function") {
			sprite.prototype.xTo = function(x) {
				this.x = x;
			}
		}
		if (typeof this.yTo != "function") {
			sprite.prototype.yTo = function(y) {
				this.y = y
			}
		}
		if (typeof this.moveTo != "function") {
			sprite.prototype.init = function(x, y) {
				this.x = x;
				this.y = y;
			}
		}
		if (typeof this.getXV != "function") {
			sprite.prototype.getXV = function(deg) {
				this.deg = deg;
			}
		}
		if (typeof this.rotate != "function") {
			sprite.prototype.rotate = function(deg) {
				this.deg = deg;
			}
		}
		if (typeof this.rotate != "function") {
			sprite.prototype.rotate = function(deg) {
				this.deg = deg;
			}
		}
		if (typeof this.rotate != "function") {
			sprite.prototype.rotate = function(deg) {
				this.deg = deg;
			}
		}
		if (typeof this.render != "function") {
			sprite.prototype.render = function() {

			}
		}



	};
})(window);