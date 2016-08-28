const qiniu  = require("qiniu")
const qiniuUtils = require('../utils/qiniu.js')

// node ./build/gitbook/sync-book-to-qiniu.js $ACCESS_KEY $SECRET_KEY
// Prepare Qiniu configuration options
accessKey = process.argv.slice(2, 3)
secretKey = process.argv.slice(3)

qiniuUtils.uploadFiles('_book/**', {
    accessKey: accessKey,
    secretKey: secretKey,
    strippedPath: '_book/',
    ignoringList: [
        '**/mvc-origin.md',
        '**/package.json',
        '_book/dist/**',
        '_book/css/**',
        '_book/images/**',
        '_book/build/**/*'
    ],
    nodir: true
})
