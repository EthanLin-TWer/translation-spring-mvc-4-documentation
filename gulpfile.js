var gulp = require('gulp');
var stylus = require('gulp-stylus');

gulp.task('css', function () {
  return gulp.src('./css/*.styl')
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('default', [ 'css' ])
