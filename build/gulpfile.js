/*
	
	This file handles the front end compilation pipeline, including the
	processing of the js, sass, hbs, and other files.

	- use '--debug' to generate source mappings
	- use '--size' to report size of each file on compilation
	- use '--minified' to minify each file on compilation

*/

var gulp       = require('gulp'),
	minimist   = require('minimist'),
	browserify = require('browserify'),
	buffer     = require('vinyl-buffer'),
	source     = require('vinyl-source-stream'),
	gulpif     = require('gulp-if'),
	sass       = require('gulp-sass'),
	run        = require('gulp-run'),
	minifycss  = require('gulp-minify-css'),
	minifyhtml = require('gulp-minify-html'),
	tap        = require('gulp-tap'),
	print      = require('gulp-print'),
	rename     = require('gulp-rename'),
	uglify     = require('gulp-uglify'),
	size       = require('gulp-size'),
	notifier   = require('node-notifier'),
	handlebars = require('gulp-handlebars'),
	declare    = require('gulp-declare'),
	wrap       = require('gulp-wrap'),
	concat     = require('gulp-concat');

var _ = require("underscore");

var options = minimist(process.argv.slice(2));
options.debug = options.debug === true;

if (options.default === true ) {
	options.debug = true;
	options.size  = true;
	options.reload = true;
}

if ( options.env === "production" ) options.minified = true;
if ( options.debug ) options.minified = false;
if ( options.minified ) options.debug = false;

if (process.argv[2] === "deploy-prod") {
	options = {
		debug: false,
		size: true,
		minified: true
	};
}

var paths = {
	pub: {
		css: "../_compiled/css",
		js: "../_compiled/js",
		html: "../_compiled",
		assets: '../_compiled/assets'
	},
	client: {
		sass: "../src/sass/**/*.scss",
		js: "../src/js/**/*.js",
		// buffon: "../src/js/buffon.js",
		buffon: "../src/js/buffon_physics2.js",
		html: "../src/**/*.html",
		templates: "../src/templates/*.hbs",
		assets: '../assets/**/*',
		content: '../content/**/*.post',
		places: '../src/js/places.js',
		root: {
			sass: "../src/sass",
			js: "../src/js",
			html: "../src"
		}	
	}
};

var bundle = function(path) {
	var filename = path.split("/").pop();
	var path = path.substring(0, path.length - filename.length);
	var error = false;

	browserify(path + filename, { debug: true })
		.bundle()
		.on('error', function(err){
			console.log(err.message);
			notifier.notify({ title: 'Browserify Build', message: err.message });
			error = true;

			// end this stream
			this.emit('end');
	    })
		.pipe(source(filename)) //Pass desired output filename to vinyl-source-stream
		.pipe(buffer())
		.pipe(print(function(){ console.log("Bundling "+ path+filename); }))
		.pipe(gulpif(options.size === true, size()))
		.pipe(gulpif(options.minified === true, uglify()))
		.pipe(gulpif(options.size === true && options.minified === true, size()))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.pub.js))
		.on('finish', function(){
			if (error) return;
			reload();
		});
};
var bundleAll = function(arr){ _.each(arr, bundle); };

gulp.task('browserify', function() {
	bundleAll([
		paths.client.root.js + '/main.js',
		paths.client.root.js + '/car_charts.js'
	]);
});

gulp.task('browserify-buffon', function() {
	bundleAll([
		// paths.client.root.js + '/buffon.js',
		paths.client.buffon
		// paths.client.root.js + '/ammo.js',
		// paths.client.root.js + '/physijs_worker.js'
	]);
});

gulp.task('browserify-places', function() {
	bundleAll([
		paths.client.places
	]);
});

gulp.task('sass', function() {
	return gulp.src([ paths.client.sass, "!" + paths.client.sass + "/**/_*.scss"])
		.pipe(sass({
			// errLogToConsole: true, 
			sourceComments : 'normal',
			onError: function(err) {
				console.log(err)
				notifier.notify({ 
					title: 'SASS Build Failed', 
					message: err.substring("/Users/coreywalsh/Documents/Work/Reactor/marionette/".length, err.length) 
				});
			}
		}))
		// .pipe(tap(function(file, t) {
	 //        console.log("THIS IS A TEST")
	 //    }))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulpif(options.minified === true, minifycss()))
		.pipe(gulpif(options.size === true, size()))
		.pipe(gulp.dest(paths.pub.css));
});

gulp.task('templates', function() {
	return gulp.src([paths.client.templates])
		.pipe(print())
		.pipe(handlebars())
		.pipe(wrap('Handlebars.template(<%= contents %>)'))
		.pipe(declare({
			namespace: 'Templates',
			// root: 'Templates',
			noRedeclare: true, // Avoid duplicate declarations
			// processName: 
		}))
		.pipe(concat('templates.js'))
		.pipe(wrap('this["Templates"] = this["Templates"] || {}; <%= contents %>'))
		.pipe(print(function(){ console.log("Bundling Templates"); }))
		.pipe(gulpif(options.size === true, size()))
		.pipe(gulpif(options.minified === true, uglify()))
		.pipe(gulpif(options.size === true && options.minified === true, size()))
		.pipe(gulp.dest(paths.pub.js));
});

gulp.task('assets', function() {
	console.log("Moving assets");
	gulp.src([paths.client.assets]).pipe(gulp.dest(paths.pub.assets));
});

gulp.task('html', function() {
	console.log("Moving HTML");
	gulp.src([paths.client.root.html + '/**/*.html'])
		.pipe(gulpif(options.minified === true, minifyhtml()))
		.pipe(gulp.dest(paths.pub.html));
});

function reload() {
	require("child_process").exec("osascript " +
		"-e 'tell application \"Google Chrome\" " +
		"to tell the active tab of its first window' " +
		"-e 'reload' " +
		"-e 'end tell'");
}

gulp.task('reload', function() {
	setTimeout(reload, 50);
});

gulp.task('content', function() {
	var cmd = new run.Command('python compile.py');
	cmd.exec('', function(err) {
		if (err != null) {
			console.log(err);
		} else {
			reload();
		}
	})
})

gulp.task('watch', function() {
	gulp.watch(paths.client.sass, ['sass', 'reload']);
	gulp.watch([paths.client.js, '!'+paths.client.buffon], ['browserify']);
	gulp.watch(paths.client.buffon,   ['browserify-buffon']);
	gulp.watch(paths.client.places,   ['browserify-places']);
	gulp.watch(paths.client.assets,   ['assets', 'reload']);
	gulp.watch(paths.client.content,   ['content']);
	gulp.watch(paths.client.html,   ['html', 'reload']);
	gulp.watch(paths.client.templates,   ['templates']);
});

gulp.task('browserify-all', ['browserify', 'browserify-buffon', 'browserify-places']);

gulp.task('build', ['sass', 'browserify-all', 'templates', 'assets', 'html', 'content']);
gulp.task('dev', ['build', 'watch']);


