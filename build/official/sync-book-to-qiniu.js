const qiniuUtils = require('../utils/qiniu.js')

// node ./build/official/sync-book-to-qiniu.js $ACCESS_KEY $SECRET_KEY
// Prepare Qiniu configuration options
accessKey = process.argv.slice(2, 3)
secretKey = process.argv.slice(3)
//
// qiniuUtils.uploadFiles('dist/**', {
//    accessKey: accessKey,
//    secretKey: secretKey,
//    strippedPath: 'dist/',
//    ignoringList: [ 'dist/build/**' ],
//    nodir: true
// })
