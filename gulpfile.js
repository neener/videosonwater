'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('browserify', function() {

  var bundler = browserify({
    entries: ['./src/js/runner.js'],
    debug: true
  });

  var bundle = function() {
    return bundler
      .bundle()
      .pipe(source('application.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('./dist/js/'));
  };

  return bundle();
});

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('lint', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe( jshint() )
    .pipe( jshint.reporter( stylish ) )
    .pipe(jshint.reporter('fail'));
});

var copy = require('gulp-copy');
gulp.task('html', function(){
  return gulp.src('./src/*.html')
    .pipe( copy("./dist") );
});

gulp.task('textures', function(){
  return gulp.src('./src/textures/*')
    .pipe( copy("./dist/textures") );
});

gulp.task('watch', function(){
    gulp.watch('./src/js/**/*.js', ['lint', 'browserify']);
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./src/textures/*', ['textures']);
});

