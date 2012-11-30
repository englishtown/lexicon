function ha() {
	/**
	 * Creates a proxy of the outer method 'handler' that first adds 'topic' to the arguments passed
	 * @returns result of proxied hanlder invocation
	 */
	return function handlerProxy() {
		// Add topic to front of arguments
		UNSHIFT.call(arguments, topic);

		// Apply with shifted arguments to handler
		return handler.apply(widget, arguments);
	};
}