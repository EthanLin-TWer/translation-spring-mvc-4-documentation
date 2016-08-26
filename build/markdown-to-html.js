const fse = require('fs-extra')
const glob = require('glob')
const marked = require('marked')

glob.sync('publish/**/*.md', {}).forEach(md => {
    fse.readFile(md, 'utf-8', (error, content) => {
        if (error) return console.error('error occured when reading file \'' + md + '\' using fs-extra, ' +
            'detailed message below:\n' + error)

        fse.outputFile(md.replace('publish', 'dist/build').replace('.md', '.html'),
            marked(content, { gfm: true }), 'utf-8');
    })
})
