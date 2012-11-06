module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		test: {
			files: ['test/**/*.js']
		},
		lint: {
			files: ['grunt.js', 'lib/**/*.js', 'test/**/*-test.js']
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'default'
		},
		jshint: {
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
				node: true
			},
			globals: {
				exports: true
			}
		},
		buster: {
			test: {
				config: 'test/buster.js'
			}
		}
	});

	// Default task.
	grunt.loadNpmTasks('grunt-buster');
	grunt.registerTask('default', 'lint buster');
};