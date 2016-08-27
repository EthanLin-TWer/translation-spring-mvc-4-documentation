const fse = require('fs-extra')
const glob = require('glob')
const marked = require('marked')

// copy all files from publish/ to dist/build/
glob.sync('publish/**/*', {}).forEach(md => {
    if (['jpg', 'png', 'jpeg'].find(pic_format => md.endsWith(pic_format))) {
        fse.copy(md, md.replace(/publish\/.*?\//, 'dist/'))
        return console.log('[image]: ' + md + ', copying to destination...')
    }

    if (fse.statSync(md).isDirectory()) {
        return console.log('[directory]: ' + md + ', returning...')
    }

    fse.readFile(md, 'utf-8', (error, content) => {
        if (error) {
            return console.error('error occured when reading file \'' + md + '\' using fs-extra, ' +
                                 'detailed message below:\n' + error + '\n')
        }

        console.log('---------------------------')
        console.log('[markdown-start]: ' + md + '   , copying to destination...')
        const destination = md.replace('publish', 'dist/build')
        fse.copySync(md, destination)
        console.log('[markdown-end]  : ' + destination + ', copied to destination successfully.')

        console.log('[preprocessing] : ' + destination + ', start overview section header from h2(##)')
        replaceHeaders(destination)
    })
})

// adjust markdown header level, for reasons below:
// in gitbook, you write chapters/sections separately, which means in all chapter/section file you
// would probably start from header 1 '#', and since now we're combining all these chapters/sections
// into one index page, in that way we have to adjust the headers so that section headers have a lower
// level than the chapter one, and sub-sections lower than sections and etc.
function replaceHeaders(md) {
    if (is_overview_section(md)) {
        // keep header level start from h2, this case is easy to handle for now
        fse.readFile(md, 'utf-8', (error, content) => {
            fse.outputFile(md, content.replace(/^#{1,6}\s*/gmi, '## '), 'utf-8')
        })
    } else if (is_ordinary_section(md)) {
        // keep header level start from h3
    } else {
        return console.error('file is not valid chapter/sectoin file: ' + md)
    }
}

function is_overview_section(section) {
    return /21-\d{1,2}\/(\D+)/gi.test(section)
}

function is_ordinary_section(section) {
    return /\/21-\d{1,2}\/(\d+)/gi.test(section)
}
