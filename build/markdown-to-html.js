const fse = require('fs-extra')
const glob = require('glob')
const marked = require('marked')

glob.sync('publish/**/*.md', {}).forEach(md => {
    fse.readFile(md, 'utf-8', (error, content) => {
        fse.outputFile(md.replace('publish', 'dist/build').replace('.md', '.html'), marked(content), 'utf-8');
    })
})
