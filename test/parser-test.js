var fs = require('fs'),
	path = require('path'), 
	buster = require("buster"),
	parser = require("../lib/parser").parser,
	fs = require('fs'),
	path = require('path'),
	assert = buster.assert;

function loadFixture(f) {
	return fs.readFileSync(__dirname + path.sep + f, 'utf-8');
}

buster.testCase("Parser", {
	"consecutive comment blocks": function() {
		/*!
		 * TroopJS jQuery weave plug-in
		 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
		 * Released under the MIT license.
		 */
		/*global define:false */

		/**
		 * TroopJS jQuery weave plug-in
		 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
		 * Released under the MIT license.
		 */

		var code = loadFixture('consecutive.js');
		var ast = parser.parse(code);
		assert.equals(ast[0]['comment']['tags'][0]['tag'], 'license');
		assert.equals(ast[0]['comment']['tags'][0]['value'], 'TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>');
	},
	"parse basic comment block": function() {
		/**
		 * @name Klass
		 * @constructor
		 * @param {String} name The class name
		 *
		 * @return {Integer} This is the return
		 */
		//function Klass(num){}

		var code = loadFixture('basic.js');
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

		assert.equals(ast[0]['function'], 'Klass');
	},

	"parse function name": function() {
		/**
		 * @name Klass
		 * @constructor
		 * @param {String} name The class name
		 *
		 * @return {Integer} This is the return
		 */
		//function Klass(name){}

		var code = loadFixture('function_name.js');

		var ast = parser.parse(code);
		assert.equals(ast[0]['function'], 'Klass');
	},

	"ignore block starting with /*": function() {
		/*
		 * @name Klass
		 * @constructor
		 * @param {String} name The class name
		 *
		 * @return {Integer} This is the return
		 */
		//function Klass(name){}

		var code = loadFixture('start_slash_star.js');
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

		var code = loadFixture('multiparams.js');
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

		assert.equals(ast[0]['function'], 'Klass');

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

		var code = loadFixture('multiline.js');

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

		assert.equals(ast[0]['function'], 'Klass');
	},

	"can parse from file": function() {
		var code = loadFixture('klass.js');
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
		assert.equals(ast[1]['function'], 'Klass');

		assert.equals(ast[2]['function'], 'Klass.prototype.copy');

		assert.equals(ast[3]['function'], 'Extend');
		assert.equals(ast[4]['function'], 'Model');
	},
	"ignore global var declarations": function() {
		/*
		var peg = require('pegjs'),
		fs = require('fs'),
		grammar = fs.readFileSync(__dirname + '/grammar.pegjs', 'utf-8'),
		parser = peg.buildParser(grammar, {trackLineAndColumn: true});

		module.exports.parser = parser;
		*/
		var code = fs.readFileSync(__dirname + '/global_declarations.js', 'utf-8');
		var ast = parser.parse(code);
		assert.equals(ast.length, 0);
	},
	"ignore /*! blocks": function() {
		/*!
		 * lexicon
		 * https://github.com/troopjs/lexicon
		 *
		 * Copyright (c) 2012 kates
		 * Licensed under the MIT license.
		 */
		var code = fs.readFileSync(__dirname + '/ignore.js', 'utf-8');
		var ast = parser.parse(code);
		assert.equals(ast.length, 0);
	},
	"amd": function() {
		var code = loadFixture('amd.js');
		var ast = parser.parse(code);

		assert.equals(ast[0]['comment']['tags'][0]['tag'], 'license');

		assert.equals(ast[1]['comment']['tags'].length, 2);
		assert.equals(ast[1]['comment']['tags'][0]['tag'], 'param');
		assert.equals(ast[1]['comment']['tags'][0]['value'], 'name');
		assert.equals(ast[1]['comment']['tags'][0]['type'], 'String');
		assert.equals(ast[1]['function'], 'AMD');
	},
	"requirejs": function() {
		var code = loadFixture('require.js');
		var ast = parser.parse(code);
		assert.equals(1,1);
	},
	"grunt": function(){
		var code = loadFixture('grunt.js');
		var ast = parser.parse(code);

		assert.equals(1,1);
	},

	"return_function": function() {
		var code = loadFixture('return_function.js');
		var ast = parser.parse(code);
		assert.equals(ast[0]['function'], 'handlerProxy');
	},
	"composejs": function(){
		var code = loadFixture('compose.js');
		var ast = parser.parse(code);
		assert.equals(ast[0]['function'], 'Widget');
		assert.equals(ast[1]['function'], 'Widget.render');
		assert.equals(ast[2]['function'], 'Logger');
		assert.equals(ast[3]['function'], 'Logger.logAndRender');
	},
	"wrapper function property": function() {
		var code = loadFixture('wrapper.js');
		var ast = parser.parse(code);
		assert.equals(ast.length, 2);
		assert.equals(ast[0]['function'], 'before');
		assert.equals(ast[1]['function'], 'after');
	},
  "optional params": function() {
    var code = loadFixture('optional.js');
    var ast = parser.parse(code);
    assert.equals(ast.length, 1);
    assert.equals(ast[0]['comment']['tags'].length, 9);
    assert.equals(ast[0]['comment']['tags'][0]['tag'], 'param');
    assert.equals(ast[0]['comment']['tags'][0]['type'], 'Object');
    assert.isTrue(ast[0]['comment']['tags'][0]['optional']);
    assert.equals(ast[0]['comment']['tags'][0]['value'], 'methods');
    assert.equals(ast[0]['comment']['tags'][1]['tag'], 'param');
    assert.equals(ast[0]['comment']['tags'][1]['type'], 'Object');
    assert.isTrue(ast[0]['comment']['tags'][1]['optional']);
    assert.equals(ast[0]['comment']['tags'][1]['value'], 'state');
    assert.equals(ast[0]['comment']['tags'][2]['tag'], 'param');
    assert.equals(ast[0]['comment']['tags'][2]['type'], 'Function');
    assert.isTrue(ast[0]['comment']['tags'][2]['optional']);
    assert.equals(ast[0]['comment']['tags'][2]['value'], 'enclose');
    assert.equals(ast[0]['comment']['tags'][3]['tag'], 'return');
    assert.equals(ast[0]['comment']['tags'][3]['type'], 'Function');
    refute.defined(ast[0]['comment']['tags'][3]['optional']);
    refute.defined(ast[0]['comment']['tags'][3]['value']);
  }
});
