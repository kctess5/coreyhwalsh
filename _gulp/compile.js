var browserify = require('browserify'),
	source     = require('vinyl-source-stream'),
	buffer     = require('vinyl-buffer'),
	sass       = require('gulp-sass'),
	minifycss  = require('gulp-minify-css'),
	rename     = require('gulp-rename'),
	uglify     = require('gulp-uglify'),
	gulpif     = require('gulp-if'),
	size       = require('gulp-size'),
	print      = require('gulp-print'),
	jsoncombine = require('gulp-jsoncombine');

var notifier = require('node-notifier');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var markdown = require('gulp-markdown');

var _ = require("underscore");

var getJsonFile = function(filename) {
	var fs = require('fs');
	return JSON.parse(fs.readFileSync(filename, 'utf8'));
}

module.exports = function(gulp, paths, options) {

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
			.pipe(gulpif(options.size == true, size()))
			.pipe(gulpif(options.minified == true, uglify()))
			.pipe(gulpif(options.size == true && options.minified == true, size()))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest(paths.pub.js))
			.on('finish', function(){
				if (error) return;
				require("child_process").exec("osascript " +
				    "-e 'tell application \"Google Chrome\" " +
				    "to tell the active tab of its first window' " +
				    "-e 'reload' " +
				    "-e 'end tell'");
			})	
	};
	var bundleAll = function(arr){ _.each(arr, bundle); };

	gulp.task('browserify', function() {
		bundleAll([
			'./scripts/init.js'
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
			.pipe(rename({suffix: '.min'}))
			.pipe(gulpif(options.minified == true, minifycss()))
			.pipe(gulpif(options.size == true, size()))
			.pipe(gulp.dest(paths.pub.css));
	});


	gulp.task('templates', function() {
		return gulp.src(['templates/*.hbs'])
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
			   .pipe(gulp.dest(paths.pub.js));
	});

	gulp.task('readme', function() {
		require("child_process").exec('doctoc .. --title Contents');
	});

	gulp.task('blog', function() {
		var Renderer = require('marked').Renderer;

		Renderer.prototype.heading = function(text, level, raw) {
		  return '<h'
		    + level
		    + '>'
		    + text
		    + '</h'
		    + level
		    + '>\n';
		};

		return gulp.src("./blog/*.md")
			.pipe(markdown({
				renderer: new Renderer
			}))
			.pipe(tap(function(file, t) {
				var filestring = file.contents.toString('ascii');

				var metaPath = file.path.substring(0, file.path.length - 4) + "json";
				var metaData = {};

				try {
					metaData = getJsonFile(metaPath);
				} catch(err) {
					console.log("PLEASE INCLUDE A METADATA FILE FOR BLOG POST \"" + file.relative.substring(0, file.relative.length - 5) + "\"")
				}

				metaData.detailed = [filestring];


				file.contents = new Buffer(JSON.stringify(metaData))
			}))
			.pipe(jsoncombine('blog.json', function(data) {
				return new Buffer(JSON.stringify(data));
			}))
			.pipe(tap(function(file, t) {
				var filestring = file.contents.toString('ascii');
				var contents = JSON.parse(filestring);
				var contentsArray = Object.keys(contents).map(function(k) { return contents[k] });

				var blog = require('../config').blog;

				blog.articles = contentsArray;

				file.contents = new Buffer(JSON.stringify(blog))
			}))
			.pipe(gulp.dest("./data"));
	})

	gulp.task('data', ['blog'], function() {
		return gulp.src("./data/*.json")
			.pipe(jsoncombine('data.json', function(data) {
				return new Buffer(JSON.stringify(data));
			}))
			.pipe(gulp.dest("./compiled/data"));
	})

	gulp.task('compile-watch', function() {
		gulp.watch(paths.client.sass, ['sass', 'reload']);
		gulp.watch(paths.client.js,   ['browserify']);
		gulp.watch(['blog/*.md', 'blog/*.json'], ['blog']);
		gulp.watch('data/*.json', ['data', 'reload'])

		gulp.watch([
			'README.md',
			// 'app/*.md',
			// 'server/*.md',
			// '../*.md'
		], ['readme'])

		gulp.watch('templates/*.hbs',   ['templates']);
	});

	gulp.task('compile', ['browserify', 'sass', 'data', 'blog', 'templates'])
	gulp.task('compile-dev', ['compile', 'compile-watch'])
};











