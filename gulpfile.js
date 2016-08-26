const gulp = require('gulp')
const stylus = require('gulp-stylus')
const markdown = require('gulp-markdown')
const watch = require('gulp-watch')

gulp.task('stylus', function () {
    return gulp.src('./css/*.styl')
        .pipe(stylus({ compress: true }))
        .pipe(gulp.dest('./dist/css/'))
})

gulp.task('markdown-to-html', function() {
    return gulp.src('./publish/**/*.md')
        .pipe(markdown())
        .pipe(gulp.dest('./dist/build/'))
})

gulp.task('watch', ['stylus'], function () {
    gulp.watch('./css/*.styl' , ['stylus'])
})

gulp.task('default', [ 'stylus', 'watch' ])
gulp.task('build', [ 'stylus', 'markdown-to-html' ])
