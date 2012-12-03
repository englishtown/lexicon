var peg = require('pegjs'),
	fs = require('fs'),
	grammar = fs.readFileSync(__dirname + '/grammar.pegjs', 'utf-8'),
	parser = peg.buildParser(grammar, {trackLineAndColumn: true, cache: true}),
	falafel = require('falafel');

module.exports.parser = {
	parse: function(code) {
		var funcs = {}, comments = [];
		var i = 0;
		function getObjectNames(node){
			if (node.type === 'Property' && node.parent.type === 'ObjectExpression') {
				var name = getObjectNames(node.parent.parent);
				return name ? name + "." + node.key.name : node.key.name;
			}

			if (node.type === 'AssignmentExpression') {
				if (node.left.type === 'Identifier') {
					return node.left.name;
				}
				return getMemberNames(node.left);
			}

			if (node.type === 'CallExpression') {				
				if (node.callee.type === 'Identifier'){
					if (node.parent.type === 'VariableDeclarator') {
						return node.parent.id.name;
					} else if (node.parent.left) {
						return getMemberNames(node.parent.left);
					}
				} else if (node.callee.type === 'MemberExpression') {
					if (node.parent.type === 'AssignmentExpression') {
						return node.parent.left.name;	
					} else if (node.parent.type === 'VariableDeclarator') {
						return node.parent.id.name;
					}
				}
			}

			if (node.type === 'Identifier') {
				return node.name;
			}

			if (node.id) {
				return node.id.name;
			}
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

		function getArgs(obj) {
			var args = obj.params;
			args = args || obj['arguments'];
			if (args) {
				return args.map(function(p){ return p.name;});
			}
		}

		// we are only interested in function declarations
		falafel(code, {comment:true, loc:true}, function(node) {
			switch(node.type) {
			case 'FunctionDeclaration':
				addNode({
					name: node.id.name,
					params: getArgs(node),
					source: node.source(),
					start: node.loc.start.line,
					end: node.loc.end.line
				});
				break;
			case 'VariableDeclaration':
				node.declarations.forEach(function(decl){
					if (decl.init) {
						if (/FunctionExpression|ObjectExpression|CallExpression/.test(decl.init.type)) {
							addNode({
								name: decl.id.name,
								params: getArgs(decl.init),
								source: node.source(),
								init: decl.init.type,
								start: node.loc.start.line,
								end: node.loc.end.line
							});
						}
					}
				});
				break;
			case 'FunctionExpression':
				if (node.id && !(/VariableDeclarator|Property|AssignmentExpressions/.test(node.parent.type))) {
					addNode({
						name: node.id.name,
						params: getArgs(node),
						source: node.source(),
						start: node.loc.start.line,
						end: node.loc.end.line
					});
				}
				break;
			case 'Property':
				if (/FunctionExpression|CallExpression/.test(node.value.type)) {
					addNode({
						name: getObjectNames(node),
						params: getArgs(node.value),
						source: node.source(),
						start: node.loc.start.line,
						end: node.loc.end.line
					});
				}
				break;
			case 'AssignmentExpression':
				if (/FunctionExpression|CallExpression/.test(node.right.type)) { // === 'FunctionExpression') {
					addNode({
						name: getMemberNames(node.left),
						params: getArgs(node.right),
						source: node.parent.source(),
						start: node.loc.start.line,
						end: node.loc.end.line
					});
				}
				break;
			case 'ReturnStatement':
				if (node.argument && /FunctionExpression|CallExpression/.test(node.argument.type)) { // === 'FunctionExpression') {
					if (node.argument.id) {
						addNode({
							name: node.argument.id.name,
							params: getArgs(node.argument),
							source: node.source(),
							start: node.loc.start.line,
							end: node.loc.end.line
						});
					}
				}
				break;
			case 'ObjectExpresson':
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

				line = line.replace(/^(.*)[,;]$/, "$1");

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