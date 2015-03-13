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
	jsoncombine = require('gulp-jsoncombine'),
	minifyHTML = require('gulp-minify-html'),
	jekyll     = require('gulp-jekyll'),
	watch      = require('gulp-watch'),
	aggregate  = require('gulp-aggregate');

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
			// .on('finish', function(){
			// 	if (error) return;
			// 	require("child_process").exec("osascript " +
			// 		"-e 'tell application \"Google Chrome\" " +
			// 		"to tell the active tab of its first window' " +
			// 		"-e 'reload' " +
			// 		"-e 'end tell'");
			// })	
	};
	var bundleAll = function(arr){ _.each(arr, bundle); };

	gulp.task('browserify', function() {
		bundleAll([
			'./_scripts/init.js'
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
		gulp.watch(paths.client.sass, ['sass']);
		gulp.watch(paths.client.js,   ['browserify']);
		gulp.watch(['_site/content/**/*.html', '!_site/content/index.html'], ['compile-jekyll']);
		
		// gulp.watch('_site/content/index.html', ['copy-root-assets']);
		// gulp.watch('content/_data/*', ['jekyll-build']);

		// gulp.watch('_compiled/**/*', ['reload']);

		gulp.watch([
			'README.md'
		], ['readme'])

		gulp.watch('templates/*.hbs',   ['templates']);
	});

	gulp.task('jekyll-watch', function() {
		return require("child_process").exec('jekyll build --watch');
	});

	gulp.task('jekyll-build', function() {
		return require("child_process").exec('jekyll build');
	});

	var opts = {
		conditionals: true,
		spare:true
	};

	gulp.task('compile-jekyll', function() {
		

		return gulp.src(['_site/content/**/*.html', '!_site/content/index.html'])
			.pipe(minifyHTML(opts))
			.pipe(tap(function(file, t) {
				var filestring = file.contents.toString();
				file.contents = new Buffer(JSON.stringify(filestring));
			}))
			.pipe(jsoncombine('content.json', function(data) {
				return new Buffer(JSON.stringify(data));
			}))
			.pipe(gulp.dest('_compiled/data/'));
	});

	var copyAssets = function() {
		gulp.src(['_site/content/*.*', '!_site/content/*.html'])
			.pipe(gulp.dest('_compiled'));
		gulp.src('_site/content/*.html')
			.pipe(minifyHTML(opts))
			.pipe(gulp.dest('_compiled'));
	};

	gulp.task('watch-root-assets', function() {
		watch([
		'_site/content/index.html'
		])
		.pipe(aggregate({debounce: 100}, function() {
			console.log("Debounced Root Assets")
			copyAssets();
		}));
	});

	gulp.task('copy-root-assets', function() {
		copyAssets();
	});

	gulp.task('compile', ['jekyll-build', 'copy-root-assets', 'browserify', 'sass', 'compile-jekyll']);
	gulp.task('compile-dev', ['compile', 'jekyll-watch', 'compile-watch', 'watch-root-assets']);
};











