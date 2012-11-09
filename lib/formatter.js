
function findTagsForTitle(tags) {
	tags.reduce(function(hash, item) {
		var tag = item.tag;
		switch(tag) {
			case 'name':
			case 'class':
				hash[tag] = item.value;
				break;
		}
	}, {});
}

function markdown(ast) {
	var md = "";

	ast.forEach(function(item) {
		if (!!item['function']) {
			var comment = item['comment'];

			md += "### " + item['function'] + " ###\n\n";

			if (!!comment['text']) {
				md += comment['text'] + "\n\n";
			}

			comment['tags'].forEach(function(item) {
				var tag = item.tag;
				switch(tag) {
					case 'name':
						md += "* @" + tag + " " + item.value + "\n";
						break;
					case 'return':
						md += "* @" + tag + " {" + item.type + "} " + item.description + "\n";
						break;
					case 'param':
						md += "* @" + tag + " {" + item.type + "} " + item.value + "\n";
						break;
				}
			});
		}
		md += "\n";
	});

	return md.trim();
}

exports.formatter = {
	format: function(ast, fmt) {
		return this[fmt].call(this, ast);
	},
	markdown: function(ast) {
		return markdown(ast);
	},
	json: function(ast) {
		return JSON.stringify(ast, null, "\t");
	},
	html: function(ast) {
		return "html";
	}
};