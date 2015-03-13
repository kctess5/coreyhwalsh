var browserify = require('browserify'),
	source     = require('vinyl-source-stream'),
	buffer     = require('vinyl-buffer'),
	sass       = require('gulp-sass'),
	minifycss  = require('gulp-minify-css'),
	rename     = require('gulp-rename'),
	uglify     = require('gulp-uglify'),
	gulpif     = require('gulp-if'),
	size       = require('gulp-size'),
	// print      = require('gulp-print'),
	jsoncombine = require('gulp-jsoncombine'),
	minifyHTML = require('gulp-minify-html'),
	jekyll     = require('gulp-jekyll');

var notifier = require('node-notifier');
// var handlebars = require('gulp-handlebars');
// var wrap = require('gulp-wrap');
// var declare = require('gulp-declare');
// var concat = require('gulp-concat');
var tap = require('gulp-tap');
// var markdown = require('gulp-markdown');

// var ROOT = require('path').join(__dirname, '../_site/content');

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

	gulp.task('readme', function() {
		require("child_process").exec('doctoc .. --title Contents');
	});

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

	gulp.task('jekll-build', function() {
		return gulp.src(['./index.html', './_layouts/*.html', './_posts/*.{markdown,md}'])
			.pipe(jekyll({
				source: './',
				destination: './_site/',
				bundleExec: true
			}))
			.pipe(gulp.dest('./_site/'));
	});

	gulp.task('comile-jekyl', 'jekll-build', function() {
		var opts = {
			conditionals: true,
			spare:true
		};

		return gulp.src(['_site/content/**/*.html', '!_site/content/index.html'])
				   .pipe(minifyHTML(opts))
				   .pipe(tap(function(file, t) {
						var filestring = file.contents.toString('ascii');
						file.contents = new Buffer(JSON.stringify(filestring));
				   }))
				   .pipe(jsoncombine('content.json', function(data) {
						return new Buffer(data);
					}))
				   .pipe(gulp.dest('_compiled/jekyll'));
	});

	gulp.task('compile', ['browserify', 'sass', 'compile-jekyl'])
	gulp.task('compile-dev', ['compile', 'compile-watch'])
};











