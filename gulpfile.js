var gulp = require('gulp');

var browserSync = require('browser-sync');
var less = require('gulp-less');
// var rename = require('gulp-rename');
var shell = require('gulp-shell');
// var uglify = require('gulp-uglify');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');
var tempStorageWorkerConfig = require('./tempstorageworker.webpack.config.js');

gulp.task('webpack-app', ['webpack-tempstorage-worker'], function() {
  return gulp.src('./src/js/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['webpack-app', 'less', 'fonts'], function(){
  browserSync.init({
    open: false,
    server: './dist'
  });

  gulp.watch('src/less/**/*.less', ['less']);
  // Re-build app and run tests on app change.
  gulp.watch('src/js/**/*.js', ['webpack-app', 'test-run']);
  // Run tests on test change.
  gulp.watch('src/__tests__/**/*.js', ['test-run']);
  gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('less', function () {
  return gulp.src('./src/less/base.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
  var bootstrapFonts = 'node_modules/bootstrap/fonts/*';
  return gulp.src([bootstrapFonts])
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('webpack-tempstorage-worker', function() {
  return gulp.src('./src/js/workers/TempStorageWorker.js')
    .pipe(webpack(tempStorageWorkerConfig))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
});

// Start test server, run tests once, then quit.
gulp.task('test', shell.task('karma start --single-run'));

// Start test server, run tests, keep server running..
gulp.task('test-start', shell.task('karma start'));

// Do a single test run (expects Karma server to be running).
gulp.task('test-run', shell.task('karma run'));

gulp.task('default', [ 'serve', 'test-start' ], function() {});
