var peg = require('pegjs'),
	fs = require('fs'),
	grammar = fs.readFileSync(__dirname + '/grammar.pegjs', 'utf-8'),
	parser = peg.buildParser(grammar, {trackLineAndColumn: true});

module.exports.parser = parser;