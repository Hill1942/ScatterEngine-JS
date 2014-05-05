(function(win) {
	var scene = win.Scene = Class.extend({
		init: function(arg) {
			arg = arg || {};
			this.name = arg.name || ("Unnamed_" + (++scene.SID));
			this.x = arg.x || 0;
			this.y = arg.y || 0;
			this.w = arg.w || 320;
			this.h = arg.h || 200;
			this.color = arg.color || "black";
			this.holder = $("<div></div>");
			this.canvas = $("<canvas></canvas>");
			this.ctx = this.canvas[0].getContext("2d");
			this.setPosition();
			this.setSize();
			this.setColor(this.color);
			this.holder.append(this.canvas);
			$(document.body).append(this.holder);
			this.listeners = [];
		},
		setPosition: function(x, y) {
			this.x = x;
			this.y = y;
			this.holder.css("left", this.x).css("top", this.y);
		},
		setSize: function(width, height) {
			this.w = width || this.w;
			this.h = height || this.h;
			this.holder.css("width", this.w).css("height", this.h);
			this.canvas.attr("width", this.w).css("height", this.h);
		},
		setColor: function(color) {
			this.color = color || "black";
			this.holder.css("background-color", this.color);
		},
		clear: function() {
			this.ctx.clearRect(0, 0, this.w, this.h);
		},
		show: function() {
			this.holder.show();
		},
		hide: function() {
			this.holder.hide();
		},
		render: function() {

		},
		update: function() {

		},
		setBackgroundImage: function(imgURL, pattern) {
			this.holder.css("background-image", "url(" + imgURL + ")");
			if (pattern == 0) {
				this.holder.css("background-repeat", "no-repeat");
				this.holder.css("background-position", "center");
			}
			else if (pattern == 1) {
				this.holder.css("background-size", this.w + "px " + this.h + "px");
			}
		},
		clean: function() {
			this.listeners = null;
			this.canvas.remove();
			this.holder.remove();
			this.canvas = this.holder = this.ctx = null;
		}

	}

})(window);