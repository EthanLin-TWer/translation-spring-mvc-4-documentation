const fse = require('fs-extra')
const glob = require('glob')
const marked = require('marked')

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

        fse.outputFile(md.replace('publish', 'dist/build').replace('.md', '.html'),
            marked(content, { gfm: true }), 'utf-8');
        return console.log('[markdown]: ' + md + ', copying to destination...')
    })
})
