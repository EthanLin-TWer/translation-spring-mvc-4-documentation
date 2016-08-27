const fse = require('fs-extra')
const glob = require('glob')
const marked = require('marked')

glob.sync('dist/build/**/*', {}).filter(file => file.endsWith('.md')).forEach(md => {
    fse.readFile(md, 'utf-8', (error, content) => {
        fse.outputFile(md.replace('.md', '.html'), marked(content, { gfm: true }), 'utf-8')
        fse.remove(md)

        return console.log('[html]: ' + md + ' converted to html, origin markdown removed')
    })
})
