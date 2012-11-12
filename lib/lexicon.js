/*
 * lexicon
 * https://github.com/troopjs/lexicon
 *
 * Copyright (c) 2012 kates
 * Licensed under the MIT license.
 */
var fs = require('fs'),
	parser = require('./parser').parser,
	formatter = require('./formatter').formatter;

exports.lexicon = function(files, format) {
	var code = "";
	if (!(files instanceof Array)) {
		files = [files];
	}
	for (var i = 0; i < files.length; i++) {
		code += fs.readFileSync(files[i], 'utf-8');
	}

	var ast = parser.parse(code);
	return formatter.format(ast, format);
};

exports.parser = parser;
exports.formatter = formatter;
