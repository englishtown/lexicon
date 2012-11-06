var peg = require('pegjs');
var fs = require('fs');
var grammar = fs.readFileSync(__dirname + '/grammar.pegjs', 'utf-8');


var parser = peg.buildParser(grammar, {trackLineAndColumn: true});

module.exports.parser = parser;