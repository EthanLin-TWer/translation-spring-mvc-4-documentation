const fs = require('fs')
const glob = require('glob')

const PREV_PRIOR = -1
const NEXT_PRIOR = 1
const MARKER_INTERPOLATION_START = '<!-- interpolation-start -->'
const MARKER_INTERPOLATION_END = '<!-- interpolation-end -->'

const all = sortInsertingHtmlsInTableOfContentOrder()
removePreviousDocumentationContents()
updateNewDocumentContent(all)

function sortInsertingHtmlsInTableOfContentOrder() {
    // dist/build directory pre-built by 'npm run markdown2html' or 'node build/markdown-to-html.js'
    // this array should be sorted in the order they are inserted to the index.html(i.e the table of content order)
    const all = glob.sync('dist/build/**/*.html', {}).sort(inTableOfContentOrder)
    console.log('order to be inserted to the \'index.html\' file: ')
    console.log(all)

    return all
}

function inTableOfContentOrder(prev, next) {
    if (sectionNumber(prev) !== sectionNumber(next)) {
        return sectionNumber(prev) < sectionNumber(next) ? PREV_PRIOR : NEXT_PRIOR
    }

    if (isSectionOverview(prev)) return PREV_PRIOR
    if (isSectionOverview(next)) return NEXT_PRIOR

    return subSectionNumber(prev) < subSectionNumber(next) ? PREV_PRIOR : NEXT_PRIOR
}

function sectionNumber(section) {
    // extract section number in such like: /21-{7}/, /21-{12}/
    return Number(/21-(\d+)/gi.exec(section)[1])
}

function isSectionOverview(section) {
    // is section overview:  /21-3/implementing-controllers.md
    // not section overview: /21-3/2-mapping-requests-with-@requestmapping.md
    return /21-\d{1,2}\/(\D+)/gi.test(section)
}

function subSectionNumber(section) {
    // extract sub-section number such like: /21-2/2-xxx.md, /21-13/1-xxx.md
    return Number(/\/21-\d{1,2}\/(\d+)/gi.exec(section)[1])
}

function removePreviousDocumentationContents() {
    const index = fs.readFileSync('index.html', 'utf-8')
    let interp_start = index.indexOf(MARKER_INTERPOLATION_START) + MARKER_INTERPOLATION_START.length
    let interp_end = index.indexOf(MARKER_INTERPOLATION_END)
    let contents = index.substring(interp_start, interp_end)

    fs.writeFileSync('index.html', index.replace(contents, ''), 'utf-8')
}

function updateNewDocumentContent(all) {
    for (let i = 0; i < all.length; i++) {
        const content = fs.readFileSync(all[i], 'utf-8')
        const index = fs.readFileSync('index.html', 'utf-8')
                .replace(MARKER_INTERPOLATION_END, '<section>' + content + '</section>' + MARKER_INTERPOLATION_END)
        fs.writeFileSync('index.html', index, 'utf-8')
    }
}
