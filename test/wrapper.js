(function(){
	return Gadget.extend(function Widget($element, displayName) {
		var self = this;

		self[$ELEMENT] = $element;

		if (displayName) {
			self.displayName = displayName;
		}
	}, {
		/**
		 * Renders content and inserts it before $element
		 */
		before : renderProxy($.fn.before),
		/**
		 * Renders content and inserts after the $element
		 */
		after : renderProxy($.fn.after)
	});
})();