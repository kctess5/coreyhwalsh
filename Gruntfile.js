module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concurrent: {
			dev: {
				tasks: ['watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		watch: {
			scripts: {
				files: [ 'scripts/**/*.js' ],
				tasks: ['browserify', 'reload'],
			},
			sass: {
				files: [ 'stylesheets/**/*.scss' ],
				tasks: ['sass', 'reload'],
			},
			templates: {
				files: [ 'templates/**/*.hbs' ],
				tasks: ['handlebars', 'reload'],
			},
			data: {
				files: [ 'data/**/*.json' ],
				tasks: [ 'merge_data', 'reload' ]
			}
		},
		browserify: {
			options: {
				debug: true
			},
			main: {
				src: [ 'scripts/init.js' ],
				dest: 'compiled/js/main.js'
			}
		},
		sass: {
			options: {
				style: 'expanded'
			},
			views: {
				files: {
					'compiled/css/main.css': 'stylesheets/main.scss'
				}
			}
		},
		handlebars: {
			options: {
				namespace: "Templates",
				processName: function(filename) {
					return filename.replace('templates/', '').replace('.hbs', '');
				}
			},
			all: {
				files: {
					"compiled/js/templates.js": ["templates/**/*.hbs"]
				}
			}
		}, 
		merge_data: {
			main: {
				src: ['data/**/*.json'],
				dest: 'compiled/data/data.json'
			}
		}
	});


	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-merge-data');

	grunt.registerTask("reload", "reload Chrome on OS X", function() {
		require("child_process").exec("osascript " +
		"-e 'tell application \"Google Chrome\" " +
		"to tell the active tab of its first window' " +
		"-e 'reload' " +
		"-e 'end tell'");
	});

	grunt.registerTask('runNode', function () {
		grunt.util.spawn({
			cmd: 'node',
			args: ['./node_modules/nodemon/nodemon.js', 'server.js'],
			opts: {
				stdio: 'inherit'
			}
		}, function () {
			grunt.fail.fatal(new Error("nodemon quit"));
		});
	});

	grunt.registerTask('compile', ['browserify', 'handlebars', 'sass', 'merge_data']);

	grunt.registerTask('default', ['compile', 'concurrent']);
	grunt.registerTask('node', ['compile', 'runNode', 'concurrent']);
};