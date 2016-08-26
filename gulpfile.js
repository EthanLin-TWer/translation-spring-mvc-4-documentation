const fs = require('fs')
const glob = require('glob')
const PREV_PRIOR = -1
const NEXT_PRIOR = 1

// dist/build directory built by npm run markdown2html or node build/markdown-to-html.js
const all = glob.sync('dist/build/**/*.html', {}).sort(inTableOfContentOrder)

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
