var peg = require('pegjs'),
	fs = require('fs'),
	grammar = fs.readFileSync(__dirname + '/grammar.pegjs', 'utf-8'),
	parser = peg.buildParser(grammar, {trackLineAndColumn: true, cache: true}),
	funcGrammar = fs.readFileSync(__dirname + '/functionGrammar.pegjs', 'utf-8'),
	funcParser = peg.buildParser(funcGrammar),
	falafel = require('falafel');

module.exports.parser = {
	parse: function(code) {
		//var ast = esprima.parse(code, {comment:true, loc: true});
		var funcs = {}, comments = [];

		function addNode(node) {
			var source = node.source();
			var declaration = source.split("\n", 1)[0].trim();

			// store the function declaration as list
			// so we can lookup same function signature found
			// different places
			if (funcs[declaration]) {
				funcs[declaration].push({
					start: node.loc.start.line,
					end: node.loc.end.line,
					source: source
				});
			} else {
				funcs[declaration] = [{
					start: node.loc.start.line,
					end: node.loc.end.line,
					source: source
				}];
			}
		}

		// we are only interested in function declarations
		falafel(code, {comment:true, loc:true}, function(node) {
			if (node.type === 'Block' && node.parent.type === 'Program') {
				comments.push(node);
			} else if (node.type === 'FunctionDeclaration') {
				addNode(node);
			} else if (node.type === 'AssignmentExpression' && node.operator === '=' &&
					node.left.type === 'MemberExpression' && node.right.type === 'FunctionExpression') {
				addNode(node);
			} else if (node.type === 'VariableDeclarator' && (node.init && node.init.type === 'FunctionExpression')) {
				addNode(node);
			}
		});

		// split the source code so we'll find
		// function declaration after the comment block.
		var codes = code.split("\n");

		return comments.reduce(function(comments, comment) {
			var doc = {};
			var parsed = parser.parse(comment['value']);

			if (parsed) {
				doc['comment'] = parsed;
				var lineNo = comment['loc']['end']['line'];
				var line = '';

				// look for the first non-emtpy line
				while(true) {
					line = codes[lineNo++];
					if (line && (line = line.trim())) {
						break;
					}
					if (lineNo > codes.length){ 
						line = '';
						break;
					}
				}

				// get the signature
				doc['function'] = funcParser.parse(line);

				// look for the source using the declaration
				var funcLine = funcs[line];

				if (funcLine) {
					for(var i=0; i < funcLine.length; i++) {
						var node = funcLine[i];
						if (node.start === lineNo) {
							doc['source'] = node.source;
						}
					}
				}

				comments.push(doc);
			}
			return comments;
		}, []);
	}
};