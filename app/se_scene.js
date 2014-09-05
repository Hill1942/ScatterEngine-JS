(function(win) {
	var scene = win.Scene = function() {

		if (typeof this.init != "function") {
			game.prototype.init = function (arg) {
				this.name = arg.name || ("UnnamedScene_" + (++scene.id));
				this.x = arg.x || 0;
				this.y = arg.y || 0;
				this.width = arg.width || 640;
				this.height = arg.height || 400;
				this.bgColor = arg.bgColor || "black";
				this.holder = $("<div id='scene_" + this.name + "' style='position:absolute;'></div>");
				this.canvas = $("<canvas></canvas>");
				this.ctx = this.canvas[0].getContext("2d");

				this.holder.append(this.canvas);
				$(document.body).append(this.holder);
			}
		}

		if (typeof this.getZIndex != "function") {
			game.prototype.getZIndex = function () {
				return this.holder.css("z-index");
			}
		}

		if (typeof this.setPosition != "function") {
			game.prototype.setPosition = function (x, y) {
				this.x = x || this.x;
				this.y = y || this.y;
				this.holder.css("left", this.x).css("top", this.y);
			}
		}

		if (typeof this.setSize != "function") {
			game.prototype.setSize = function (width, height) {
				this.width = width || this.width;
				this.height = height || this.height;
				this.holder.css("width", this.width).css("height", this.height);
				this.canvas.attr("width", this.width).attr("height", this.height);
			}
		}

		if (typeof this.setBgColor != "function") {
			game.prototype.setBgColor = function (bgColor) {
				this.bgColor = bgColor || "black";
				this.holder.css("background-color", this.bgColor);
			}
		}

		if (typeof this.setBgImage != "function") {
			game.prototype.setBgImage = function (imgURL, pattern) {
				if (pattern == 0) {
					this.holder.css("background-repeat", "no-repeat");
					this.holder.css("background-position", "center");
				} else if (pattern == 1) {
					this.holder.css("background-size",
					 this.width + "px " + this.height + "px");
				}
			}
		}

		if (typeof this.clear != "function") {
			game.prototype.clear = function () {
				this.ctx.clearRect(0, 0, this.width, this.height);
			}
		}

		if (typeof this.show != "function") {
			game.prototype.show = function () {
				this.holder.show();
			}
		}

		if (typeof this.hide != "function") {n
			game.prototype.hide = function () {
				this.holder.hide();
			}
		}

		if (typeof this.clean != "function") {
			game.prototype.clean = function () {
				this.holder.canvas.remove();
				this.holder.remove();
				this.canvas = this.holder = null;
			}
		}

		scene.id = 0;



	} // end Class
})(window);