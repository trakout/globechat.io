// gulp configuration constants
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify');

gulp.task('styles', function() {
  return gulp.src('pages/style/sass/*.sass')
    .pipe(sass({ style: 'expanded' }))
    .pipe(gulp.dest('pages/style/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('pages/style/css'))
    .pipe(notify('sass minified.'));
});
gulp.task('js', function() {
  return gulp.src('pages/js/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('pages/js/min'))
    .pipe(notify('js minified.'));
});



// project-specific gulp-configs
gulp.task('startindex', function() {
	var debug = false;

	var server = require("./server")
	, router = require("./route")
	, requestHandlers = require("./requestHandlers");
	 
	var handle = {};
	handle["/"] = requestHandlers.sendInterface
	, handle["/main.css"] = requestHandlers.sendMainCss
	, handle["/interface"] = requestHandlers.sendInterface
	, handle["/plugins.js"] = requestHandlers.sendPluginJs
	, handle["/main.js"] = requestHandlers.sendMainJs
	, handle["/modernizr-2.6.2.min.js"] = requestHandlers.sendModernizr;

	server.start(router.route,handle,debug);
});



gulp.task('watch', function() {
  gulp.watch('pages/style/sass/*.sass', ['styles']);
  gulp.watch('pages/js/*.js', ['js']);
});


gulp.task('default', ['startindex', 'watch'], function() {

});


