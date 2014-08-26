/* simple JavaScript Inherritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
(function(win) {
	var initializing = false;
	var fnTest = /xyz/.test(function() {xyz;}) ? /\b_super\b/ : /.*/;
	//The base Class implementation (does nothing)
	this.Class = function() {};

	//Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var _super = this.prototype;

		//Instantiate a base class (but only create the instance,
		//don't run the init constructor)
		initializing = true;
		var protytype = new this();
		initializing = false;

		for (var name in prop) {
			prototype[name] = 
			typeof prop[name]   == "function" && 
			typeof _super[name] == "function" &&
			fnTest.test(prop[name]) ?
			(function(name, fn) {
				return function() {
					var tmp = this._super;
					this._super = _super[name];
					var ret = fn.apply(this, arguments);
					this._super = tmp;

					return ret;
				};
			})(name, prop[name]):
			prop[name];
		}

		function Class() {
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}

		Class.prototype = prototype;
		Class.prototype.constructor = Class;
		Class.extend = arguments.callee;

		return Class;
	};
})(window);