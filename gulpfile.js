const gulp = require('gulp')
const stylus = require('gulp-stylus')
const markdown = require('gulp-markdown')
const watch = require('gulp-watch')
const fs = require('fs')
const glob = require('glob')

function extractDocs() {
    const all = glob.sync('dist/build/**/*.html', {}).sort((previous, next) => {
        const previousChapter = Number(/21-(\d+)/gi.exec(previous)[1])
        const nextChapter = Number(/21-(\d+)/gi.exec(next)[1])

        if (previousChapter !== nextChapter) {
            return previousChapter < nextChapter ? -1 : 1;
        }

        if (/21-\d{1,2}\/(\D+)/gi.test(previous)) return -1
        if (/21-\d{1,2}\/(\D+)/gi.test(next)) return 1

        const previousSubSection = Number(/\/21-\d{1,2}\/(\d+)/gi.exec(previous)[1])
        const nextSubSection = Number(/\/21-\d{1,2}\/(\d+)/gi.exec(next)[1])

        return previousSubSection < nextSubSection ? -1 : 1
    })

    const temp = fs.readFileSync('index.html', 'utf-8')
    let interp_start = temp.indexOf('<div class="documentation-main chapter">') + '<div class="documentation-main chapter">'.length
    let interp_end = temp.indexOf('<!-- interpolation -->')
    let removing = temp.substring(interp_start, interp_end)
    fs.writeFileSync('index.html', temp.replace(removing, ''), 'utf-8')

    console.log(all)

    for (let i = 0; i < all.length; i++) {
        file = all[i];
        const content = fs.readFileSync(file, 'utf-8')
        const index = fs.readFileSync('index.html', 'utf-8')
                .replace('<!-- interpolation -->', '<section>' + content + '</section' + '<!-- interpolation -->')
        fs.writeFileSync('index.html', index, 'utf-8')
    }

}

extractDocs()


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

gulp.task('default', [ 'markdown-to-html', 'stylus', 'watch' ])
gulp.task('style', [ 'stylus', 'watch' ])
gulp.task('build', [ 'markdown-to-html', 'stylus' ])
