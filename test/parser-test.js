var buster = require("buster"),
	parser = require("../lib/parser").parser,
	fs = require('fs'),
	assert = buster.assert;


buster.testCase("Parser", {
	"comment block 0": function() {
		/*
		 * @name Klass
		 * @param {String} name The class name
		 *
		 * @return {Object} This is the return
		 */
		//function Klass(num){}

		var code = "/*\n * @name Klass\n * @param {String} name The class name\n *\n * @return {Integer} This is the return\n */\nfunction Klass(name){}";
		var ast = parser.parse(code);

		assert.equals(ast[0]['comment']['tags'].length, 3);
		assert.equals(ast[0]['comment']['tags'][0]['tag'], 'name');
		assert.equals(ast[0]['comment']['tags'][0]['value'], 'Klass');

		assert.equals(ast[0]['comment']['tags'][1]['tag'], 'param');
		assert.equals(ast[0]['comment']['tags'][1]['value'], 'name');
		assert.equals(ast[0]['comment']['tags'][1]['type'], 'String');
		assert.equals(ast[0]['comment']['tags'][1]['description'], 'The class name');

		assert.equals(ast[0]['comment']['tags'][2]['tag'], 'return');
		assert.equals(ast[0]['comment']['tags'][2]['type'], 'Integer');
		assert.equals(ast[0]['comment']['tags'][2]['description'], 'This is the return');

		assert.equals(ast[0]['function']['name'], 'Klass');
		assert.equals(ast[0]['function']['args'].length, 1);
		assert.equals(ast[0]['function']['args'][0], 'name');
	},

	"comment block 1": function() {
		/**
		 * @name Klass
		 * @param {String} name The class name
		 * @param {Object} options Option
		 *
		 * @return {Object} This is the return
		 */
		//function Klass(num){}

		var code = "/**\n * @name Klass\n * @param {String} name The class name\n * @param {Object} options Options\n *\n * @return {Integer} This is the return\n */\nfunction Klass(num){}";
		var ast = parser.parse(code);

		assert.equals(ast[0]['comment']['tags'].length, 4);
		assert.equals(ast[0]['comment']['tags'][0]['tag'], 'name');
		assert.equals(ast[0]['comment']['tags'][0]['value'], 'Klass');

		assert.equals(ast[0]['comment']['tags'][1]['tag'], 'param');
		assert.equals(ast[0]['comment']['tags'][1]['value'], 'name');
		assert.equals(ast[0]['comment']['tags'][1]['type'], 'String');
		assert.equals(ast[0]['comment']['tags'][1]['description'], 'The class name');

		assert.equals(ast[0]['comment']['tags'][2]['tag'], 'param');
		assert.equals(ast[0]['comment']['tags'][2]['value'], 'options');
		assert.equals(ast[0]['comment']['tags'][2]['type'], 'Object');
		assert.equals(ast[0]['comment']['tags'][2]['description'], 'Options');
	}
});