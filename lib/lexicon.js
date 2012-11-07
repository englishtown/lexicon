/*
 * lexicon
 * https://github.com/troopjs/lexicon
 *
 * Copyright (c) 2012 kates
 * Licensed under the MIT license.
 */
var fs = require('fs'),
	parser = require("./parser").parser;

exports.lexicon = function(files) {
	var code = "";

	for (var i = 0; i < files.length; i++) {
		code += fs.readFileSync(files[i], 'utf-8');
	}

	var ast = parser.parse(code);
	return ast;
};

exports.parser = parser;
