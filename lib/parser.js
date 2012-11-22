var peg = require('pegjs'),
	fs = require('fs'),
	grammar = fs.readFileSync(__dirname + '/grammar.pegjs', 'utf-8'),
	parser = peg.buildParser(grammar, {trackLineAndColumn: true, cache: true}),
	funcGrammar = fs.readFileSync(__dirname + '/functionGrammar.pegjs', 'utf-8'),
	funcParser = peg.buildParser(funcGrammar),
	esprima = require('esprima');

module.exports.parser = {
	parse: function(code) {
		var ast = esprima.parse(code, {comment:true, loc: true});
		var codes = code.split("\n");
		return ast['comments'].reduce(function(comments, comment){
			if (comment['type'] === 'Block') {
				var doc = {};
				var parsed = parser.parse(comment['value']);
				//console.log(comment);
				if (parsed) {
					doc['comment'] = parsed;
					var line = codes[comment['loc']['end']['line']];
					//console.log(line);
					//console.log(funcParser.parse(line));
					doc['function'] = funcParser.parse(line);
					comments.push(doc);
				}
			}
			return comments;
		}, []);
	}
};