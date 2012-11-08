
exports.formatter = {
	format: function(ast, fmt) {
		return this[fmt].call(this, ast);
	},
	markdown: function(ast) {
		return "# Markdown Rulez #";
	},
	json: function(ast) {
		return JSON.stringify(ast);
	},
	html: function(ast) {
		return "html";
	}
};