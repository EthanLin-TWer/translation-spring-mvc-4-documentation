const glob = require('glob')
const fse = require('fs-extra')

glob.sync('publish/**/*', {}).filter(file => ['jpg', 'png', 'jpeg'].find(picFormat => file.endsWith(picFormat))).forEach(pic => {
    fse.copy(pic, pic.replace(/publish\/.*?\//, 'dist/'))
    console.log('[image]: ' + pic + ', copying to destination...')
})
