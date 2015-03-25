var gulp = require('gulp'),
  jshint = require('gulp-jshint');

gulp.task('default', ['lint']);

gulp.task('lint', function () {
  return gulp.src('./lib/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
