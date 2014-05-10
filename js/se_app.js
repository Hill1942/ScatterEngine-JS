(function(win) {
	var game = win.Game = function() {
		this.paused = false;
		this.fps    = 0;
		this.listeners = [];

		if (typeof this.loop != "function") {
			game.prototype.loop = function () {

			}
		}

		if (typeof this.run != "function") {
			game.prototype.run = function(fps) {
				this.fps = fps || 60;
				var thisGame = this;
				var timeSlice = 1000 / fps;
				FrameState.start();
				this.go = setInterval(function() {
					FrameState.update();
					if (!thisGame.paused) {
						thisGame.loop();
					}
				}, timeSlice);
			}
		}

		if (typeof this.pause != "function") {
			game.prototype.pause = function() {
				this.paused = true;
			}
		}

		if (typeof this.stop != "function") {
			game.prototype.stop = function() {
				clearInterval(this.go);
			}
		}

		if (typeof this.addListener != "function") {
			game.prototype.addListener = function(listener) {
				this.listeners.push(listener);
			}
		}

		if (typeof this.clearListeners != "function") {
			game.prototype.clearListeners = function() {
				this.listeners.length = 0;
			}
		}


	}
})(window);