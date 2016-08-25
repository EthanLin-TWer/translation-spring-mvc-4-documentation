const gulp = require('gulp');
const stylus = require('gulp-stylus');
const watch = require('gulp-watch');

gulp.task('stylus', function () {
  return gulp.src('./css/*.styl')
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('watch', ['stylus'], function () {
    gulp.watch('./css/*.styl' , ['stylus']);
});

gulp.task('default', [ 'stylus', 'watch' ])
