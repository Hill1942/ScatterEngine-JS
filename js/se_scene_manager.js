(function(win) {
	var sceneManager = win.SceneManager = function() {

		this.scenes = [];
		this.namedScenes = {};

		if (typeof this.init != "function") {
			sceneManager.prototype.init = function () {
			}
		}

		if (typeof this.createScene != "function") {
			sceneManager.prototype.createScene = function (arg) {
				var scene = new Scene();
				scene.init(arg);
				this.scenes.push(scene);
				return scene;
			}
		}

		if (typeof this.getSceneByName != "function") {
			sceneManager.prototype.getSceneByName = function (name) {
				return this.namedScenes[name];
			}
		}

		if (typeof this.getSceneByZIndex != "function") {
			sceneManager.prototype.getSceneByIndex = function (z_index) {
				return this.scenes[z_index];
			}
		}

		if (typeof this.deleteSceneByName != "function") {
			sceneManager.prototype.deleteSceneByName = function (name) {
				var scene = this.namedScenes[name];
				if (scene != null) {
					delete this.namedScenes[name];
					for (var i = 0; i < this.scenes.length; i++) {
						if (scene.name == scenes[i].name) {
							scenes.splice(i, 1);
							break;
						}
					}
					this.sortSceneIndex();
				}
			}
		}

		if (typeof this.push != "function") {
			sceneManager.prototype.push = function (scene) {
				if (!this.getSceneByName(scene.name)) {
					this.scenes.push(scene);
					this.namedScenes[scene.name] = scene;
					this.sortSceneIndex();
				}
			}
		}

		if (typeof this.pop != "function") {
			sceneManager.prototype.pop = function () {
				var scene = this.scenes.pop();
				if (scene != null) {
					scene.clean();
					delete namedScenes[scene.name];
					this.sortSceneIndex();
				}
			}
		}

		if (typeof this.sortSceneIndex != "function") {
			sceneManager.prototype.sortSceneIndex = function () {
				for (var i = 0; i < this.scenes.length; i++) {
					var scene = this.scenes[i];
					scene.holder.css("z-index", i);
				}
			}
		}

		if (typeof this.swap != "function") {
			sceneManager.prototype.swap = function (from, to) {
				if (from >= 0 && from <= this.scenes.length - 1 &&
					to   >= 0 && to   <= this.scenes.length - 1) {
					var scene = this.scenes[from];			    
				    this.scenes[from] = this.scenes[to];
				    this.scenes[to] = scene;
				    this.sortSceneIndex();
				}
			}
		}

		if (typeof this.forward != "function") {
			sceneManager.prototype.forward = function (scene) {
				var from = scene.getZIndex();
				if (from < this.scenes.length - 1) {
					this.swap(from, from + 1);
				}
			}
		}

		if (typeof this.backward != "function") {
			sceneManager.prototype.backward = function () {
				var from = scene.getZIndex();
				if (from  > 0) {
					this.swap(from, from - 1);
				}
			}
		}

		if (typeof this.moveToSurface != "function") {
			sceneManager.prototype.moveToSurface = function (scene) {
				if (scene.getZIndex() < this.scenes.length - 1) {
					this.scenes.splice(scene.getZIndex(), 1);
					this.scenes[this.scenes.length - 1] = scene;
					this.sortSceneIndex();
				}

			}
		}

		if (typeof this.moveToBottom != "function") {
			sceneManager.prototype.moveToBottom = function (scene) {
				if (scene.getZIndex() > 0) {
					this.scenes.splice(scene.getZIndex(), 1);
					this.scenes.splice(0, 0, scene);
					this.sortSceneIndex();
				}
			}
		}

		
		
	}

})(window);