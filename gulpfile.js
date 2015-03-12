/*

	- use '--debug' to generate source mappings
	- use '--size' to report size of each file on compilation
	- use '--minified' to minify each file on compilation

*/

var gulp      = require('gulp'),
	nodemon   = require('gulp-nodemon'),
	minimist  = require('minimist'),
	concat    = require('gulp-concat'),
	confirm   = require('gulp-confirm');

var _ = require("underscore");

var options = minimist(process.argv.slice(2));
options.debug = options.debug === true;

if (options.default === true ) {
	options.debug = true;
	options.size  = true;
	options.reload = true;
}

if ( options.env == "production" ) options.minified = true;
if ( options.debug ) options.minified = false;
if ( options.minified ) options.debug = false;

if (process.argv[2] == "deploy-prod") {
	options = {
		debug: false,
		size: true,
		minified: true
	}
}

var paths = {
	pub: {
		css: "compiled/css",
		js: "compiled/js",
		html: "compiled"
	},
	client: {
		sass: "stylesheets/**/*.scss",
		js: "scripts/**/*.js",
		root: {
			sass: "stylesheets",
			js: "scripts"
		}
	},
	server: {
		js: "server.js",
		main: "server.js"
	}
}

var devTasks = ['demon'];
var buildTasks = []

gulp.task('reload', function() {
	setTimeout(function(){
		require("child_process").exec("osascript " +
			"-e 'tell application \"Google Chrome\" " +
			"to tell the active tab of its first window' " +
			"-e 'reload' " +
			"-e 'end tell'");
	}, 50)
});

(function(scripts) {
	_.each(scripts, function(script) {
		require('./gulp/' + script )(gulp, paths, options);
		devTasks.push(script + '-dev');
		buildTasks.push(script)
	});
})([ 'compile' ]) //  

gulp.task('demon', function () {
	nodemon({
		script: 'server.js',
		ext: 'js',
		env: {
			'NODE_ENV': 'development',
		},
		verbose: false,
		watch: ["server.js"]
	});
		// .on('start', ['watch']);
});

gulp.task('deploy-aws', ['build'], function() {
	return gulp.src('config.js').pipe(confirm({
		question: 'This will compile the site and deploy it to production. Continue? (y/n)',
		continue: function(answer) {
			if (answer.toLowerCase() === 'y') {
				var child = require('child_process').execFile('./deploy.sh');
				child.stdout.on('data', function(data) {
					console.log(data.toString())
				})
				return true
			}
			return false
		}
	}));
})

var deployTasks = ['build', 'deploy-aws'];

gulp.task('build', buildTasks)
gulp.task('dev', devTasks);
gulp.task('deploy-prod', deployTasks)

