const fse = require('fs-extra')
const glob = require('glob')
const marked = require('marked')

// copy all files from publish/ to dist/build/
glob.sync('publish/**/*', {}).forEach(md => {
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

        console.log('[preprocessing] : ' + destination + ', adjusting markdown headers...')
        replaceHeaders(destination, content) // this can be async since they are operating on separate files
        console.log('[preprocessing] : ' + destination + ', header processed successfully.')

        // add your customization preprocess steps here
    })
})

// adjust markdown header level, for reasons below:
// in gitbook, you write chapters/sections separately, which means in all chapter/section file you
// would probably start from header 1 '#', and since now we're combining all these chapters/sections
// into one index page, in that way we have to adjust the headers so that section headers have a lower
// level than the chapter one, and sub-sections lower than sections and etc.
function replaceHeaders(md, content) {
    if (isValidSection(md) && needsHeaderAdjustment(md, content)) {
        fse.outputFile(md, content.replace(HEADER_REGEX, "$1" + adjustment(md, content)), 'utf-8')
    }
}

function needsHeaderAdjustment(md, content) {
    return (baseHeaderLevel(md) - currentHeaderLevel(content)) !== 0
}

function isValidSection(md) {
    return isOverviewSection(md) || isOrdinarySection(md)
}

function adjustment(md, content) {
    return '#'.repeat(baseHeaderLevel(md) - currentHeaderLevel(content))
}

function baseHeaderLevel(md) {
    return isOverviewSection(md) ? 2 : isOrdinarySection(md) ? 3 : -1
}

const HEADER_REGEX = /^(#+)/gm

function currentHeaderLevel(content) {
    return content.match(HEADER_REGEX).reduce((min, current) => {
        return current.length < min.length ? current : min
    }).length
}

function isOverviewSection(section) {
    return /21-\d{1,2}\/(\D+)/gi.test(section)
}

function isOrdinarySection(section) {
    return /\/21-\d{1,2}\/(\d+)/gi.test(section)
}
