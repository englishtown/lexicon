var buster = require("buster"),
	parser = require("../lib/parser").parser,
	fs = require('fs'),
	assert = buster.assert;


buster.testCase("Parser", {
	"parse basic comment block": function() {
		/*
		 * @name Klass
		 * @constructor
		 * @param {String} name The class name
		 *
		 * @return {Object} This is the return
		 */
		//function Klass(num){}

		var code = "/**\n * @name Klass\n * @constructor\n * @param {String} name The class name\n *\n * @return {Integer} This is the return\n */\nfunction Klass(name){}";
		var ast = parser.parse(code);

		assert.equals(ast[0]['comment']['tags'].length, 4);
		assert.equals(ast[0]['comment']['tags'][0]['tag'], 'name');
		assert.equals(ast[0]['comment']['tags'][0]['value'], 'Klass');

		assert.equals(ast[0]['comment']['tags'][1]['tag'], 'constructor');

		assert.equals(ast[0]['comment']['tags'][2]['tag'], 'param');
		assert.equals(ast[0]['comment']['tags'][2]['value'], 'name');
		assert.equals(ast[0]['comment']['tags'][2]['type'], 'String');
		assert.equals(ast[0]['comment']['tags'][2]['description'], 'The class name');

		assert.equals(ast[0]['comment']['tags'][3]['tag'], 'return');
		assert.equals(ast[0]['comment']['tags'][3]['type'], 'Integer');
		assert.equals(ast[0]['comment']['tags'][3]['description'], 'This is the return');

		/*assert.equals(ast[0]['function']['name'], 'Klass');
		assert.equals(ast[0]['function']['args'].length, 1);
		assert.equals(ast[0]['function']['args'][0], 'name');
		*/
	},

	"parse function name": function() {
		var code = "/**\n * @name Klass\n * @constructor\n * @param {String} name The class name\n *\n * @return {Integer} This is the return\n */\nfunction Klass(name){}";

		var ast = parser.parse(code);
		assert.equals(ast[0]['function'], 'Klass');
	},

	"ignore block starting with /*": function() {
		var code = "/*\n * @name Klass\n * @constructor\n * @param {String} name The class name\n *\n * @return {Integer} This is the return\n */\nfunction Klass(name){}";
		var ast = parser.parse(code);

		assert.equals(ast.length, 0);
	},

	"ignore block starting with /***+": function() {
		var code = "/*\n * @name Klass\n * @constructor\n * @param {String} name The class name\n *\n * @return {Integer} This is the return\n */\nfunction Klass(name){}";
		var ast = parser.parse(code);

		assert.equals(ast.length, 0);
	},

	"parse block with multiple params": function() {
		/**
		 * @name Klass
		 * @param {String} name The class name
		 * @param {Object} options Options
		 *
		 * @return {Object} This is the return
		 */
		//function Klass(num){}

		var code = "/**\n * @name Klass\n * @param {String} name The class name\n * @param {Object} options Options\n *\n * @return {Object} This is the return\n */\nfunction Klass(num){}";
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

		assert.equals(ast[0]['comment']['tags'][3]['tag'], 'return');
		assert.equals(ast[0]['comment']['tags'][3]['type'], 'Object');
		assert.equals(ast[0]['comment']['tags'][3]['description'], 'This is the return');

	},

	"parse block with multiline text": function() {
		/**
		 * This is a usage documentation
		 * in multiline.
		 *
		 * This is another paragraph
		 * that is multiline.
		 *
		 * @name Klass
		 *
		 * @param {String} name The class name
		 * @param {Object} options Options
		 *
		 * @return {Object} instance
		 */
		//function Klass(name, options){}

		var code = "/**\n * This is a usage documentation\n * in multiline.\n *\n * This is another paragraph\n * that is multiline.\n *\n * @name Klass\n *\n * @param {String} name The class name\n * @param {Object} options Options\n *\n * @return {Object} This is the return\n */\nfunction Klass(num){}";
		
		var multilineText = "This is a usage documentation\nin multiline.\n\nThis is another paragraph\nthat is multiline.";
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

		assert.equals(ast[0]['comment']['tags'][3]['tag'], 'return');
		assert.equals(ast[0]['comment']['tags'][3]['type'], 'Object');
		assert.equals(ast[0]['comment']['tags'][3]['description'], 'This is the return');

		assert.equals(ast[0]['comment']['text'], multilineText);
	},
	"can parse from file": function() {
		var code = fs.readFileSync(__dirname + '/klass.js', 'utf-8');
		var ast = parser.parse(code);

		// check the number of comment blocks in the file.
		assert.equals(ast.length, 6);

		// verify parse ordering. not that it mattered.
		// also check that tags and values aren't mangled
		// from other comment blocks
		assert.equals(ast[0]['comment']['tags'][0]['tag'], 'author');
		assert.equals(ast[0]['comment']['tags'][0]['value'], 'kates');

		assert.equals(ast[1]['comment']['tags'][0]['tag'], 'name');
		assert.equals(ast[1]['comment']['tags'][0]['value'], 'Klass');
	}
});