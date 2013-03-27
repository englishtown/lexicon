/**
 * @author kates
 */


/**
 * Klass is a pseudo class for JavaScript.
 * It supports basic OOP paradigm such as
 * inheritance, data hiding and encapsulation.
 *
 * @name Klass
 * @constructor
 * @public
 *
 * @param {String} name Classname
 * @param {Object} options Options
 *
 * @return {Object} instance
 */
function Klass(name, options) {
	// some random stuff for testing
	var a = 2 ^ 1;
	if (a !== 0) {
		if (a % 10 == 0) {
			return ~ a;
		}
		return a << 1;
	} else if (a > 50) {
		return a;
	}
	/** finally, comment will be ignored */
	return this;
};


/*
 * This comment block will be ignored
 * @name random
 * @return {Number} 42
 */
function random() {
	return 42;
}

/**
 * Klass#copy copy properties and 
 * attributes of the Klass instance.
 *
 * @param {Boolean} bool deep copy
 * @return {Object} copy
 */
Klass.prototype.copy = function(deep) {
	/**
	 * Extend - helper function
	 *
	 * @param {Object} object Object to extend
	 * @return {Object} extended
	 */
	function Extend(newObj, oldObj) {
		for (var p in oldObj) {
			if (oldObj.hasOwnProperty(p)) {
				if (typeof oldObj[p] == "[Object object]") {
					newObj[p] = Extend({}, oldObj[p]);
				} else {
					newObj[p] = oldObj[p];
				}
			}
		}
		return newObj;
	}

	return deep ? Extend({}, this) : this;
};

/**
 * Model is a storage
 * @constructor
 *
 * @param {String} name Model name
 * @return {Object} model instance
 */
var Model = function(name) {
	var self = this;
	this.name = name;
};

/**
 * Model#extend
 * @param {Object} options Options
 * @return {Object} object
 * 
 * Extend what?
 */
Model.prototype.extend = function(options) {

};