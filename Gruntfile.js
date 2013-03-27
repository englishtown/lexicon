module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		test: {
			files: ['test/**/*.js']
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'default'
		},
		jshint: {
			all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*-test.js'],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				strict: false,
				node: true,
				multistr: true
			},
			globals: {
				exports: true
			}
		},
		buster: {
			config: {}
		}
	});

	// Default task.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-plugin-buster');
	grunt.registerTask('default', ['jshint','buster']);
};