
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
	var doc = "";

	ast.forEach(function(item) {
		var md = "";
		if (!!item['function']) {
			var comment = item['comment'];
			var name;

			comment['tags'].forEach(function(item) {
				md += "* @" + item.tag;

				if (item.tag === 'name') {
					name = item.value;
				}

				if (item.type) {
					md += " {" + item.type + "}";
				}

				if (item.value) {
					if (item.optional) {
						md += " [" + item.value + "]";
					} else {
						md += " " + item.value;
					}
				}

				if (item.description) {
					md += " " + item.description;
				}

				md += "\n";
			});

			if (!!comment['text']) {
				md += comment['text'] + "\n\n";
			}


			md = "### " + (item['function'] || name) + " ###\n\n" + md;
		}
		doc += md + "\n";
	});

	return doc.trim();
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
