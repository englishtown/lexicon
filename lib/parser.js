var peg = require('pegjs'),
	fs = require('fs'),
	grammar = fs.readFileSync(__dirname + '/grammar.pegjs', 'utf-8'),
	parser = peg.buildParser(grammar, {trackLineAndColumn: true, cache: true}),
	falafel = require('falafel');

module.exports.parser = {
	parse: function(code) {
		//var ast = esprima.parse(code, {comment:true, loc: true});
		var funcs = {}, comments = [];

		function getObjectNames(node){
			//console.log("NODE", node);
			if (node.type === 'Property' && node.parent.type === 'ObjectExpression') {
				return getObjectNames(node.parent.parent) + "." + node.key.name;
			}
			if (node.type === 'AssignmentExpression') {
				return getMemberNames(node.left);
			}
			return node.id.name;
		}

		function getMemberNames(node) {
			if (node.type === 'MemberExpression') {
				return getMemberNames(node.object) + "." + node.property.name;
			}
			return node.name;
		}

		function addNode(node) {
			var source = node.source;
			var declaration = source.split("\n", 1)[0].trim();

			// store the function declaration as list
			// so we can lookup same function signature found
			// different places
			if (funcs[declaration]) {
				funcs[declaration].push(node);
			} else {
				funcs[declaration] = [node];
			}
		}

		// we are only interested in function declarations
		falafel(code, {comment:true, loc:true}, function(node) {
			switch(node.type) {
			case 'FunctionDeclaration':
				addNode({
					name: node.id.name,
					params: node.params.map(function(p) { return p.name;}),
					source: node.source(),
					start: node.loc.start.line,
					end: node.loc.end.line
				});
				break;
			case 'VariableDeclaration':
				node.declarations.forEach(function(decl){
					if (decl.init) {
						if (decl.init.type === 'FunctionExpression') {
							addNode({
								name: decl.id.name,
								params: decl.init.params.map(function(p){ return p.name;}),
								source: node.source(),
								init: decl.init.type,
								start: node.loc.start.line,
								end: node.loc.end.line
							});
						} else if (decl.init.type === 'ObjectExpression') {
							addNode({
								name: decl.id.name,
								source: node.source(),
								start: node.loc.start.line,
								end: node.loc.end.line
							});
						}
					}
				});
				break;
			case 'FunctionExpression':
				if (node.id && !(node.parent.type === 'VariableDeclarator' || node.parent.type === 'Property' || node.parent.type === 'AssignmentExpression')) {
					addNode({
						name: node.id.name,
						params: node.params.map(function(p){ return p.name;}),
						source: node.source(),
						start: node.loc.start.line,
						end: node.loc.end.line
					});
				}
				break;
			case 'Property':
				if (node.value.type === 'FunctionExpression') {
					addNode({
						name: getObjectNames(node),
						params: node.value.params.map(function(p){ return p.name;}),
						source: node.source(),
						start: node.loc.start.line,
						end: node.loc.end.line
					});
				}
				break;
			case 'AssignmentExpression':
				if (node.right.type === 'FunctionExpression') {
					addNode({
						name: getMemberNames(node.left),
						params: node.right.params.map(function(p){ return p.name;}),
						source: node.source(),
						start: node.loc.start.line,
						end: node.loc.end.line
					});
				}
				break;
			case 'ReturnStatement':
				if (node.argument && node.argument.type === 'FunctionExpression') {
					if (node.argument.id) {
						addNode({
							name: node.argument.id.name,
							params: node.argument.params.map(function(p){ return p.name;}),
							source: node.source(),
							start: node.loc.start.line,
							end: node.loc.end.line
						});
					}
				}
				break;
			case 'Block':
				if (node.parent.type === 'Program') {
					comments.push(node);
				}
				break;
			default:
				break;
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
				var funcLine = funcs[line];
				if (funcLine) {
					for(var i=0; i < funcLine.length; i++) {
						var node = funcLine[i];
						if (node.start === lineNo) {
							doc['source'] = node.source;
							doc['function'] = node.name;
						}
					}
				}

				comments.push(doc);
			}
			return comments;
		}, []);
	}
};