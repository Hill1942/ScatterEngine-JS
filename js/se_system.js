(function(win) {
	var frameState = win.FrameState = {
		maxFrame:     0,
		minFrame:     0,
		currentFrame: 0,		lastTime:     0,
		frames:       0,

		start: function() {
			this.lastTime = new Date();±±
		},
		update: function() {
			var newTime = new Date();
			if (newTime - lastTime > 1000) {
				currentFrame = frames;
				lastTime     = newTime;
				frames       = 0;
			}
			else {
				frames++;
			}
		}
	}
})