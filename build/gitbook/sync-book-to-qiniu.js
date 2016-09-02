const Qiniu = require('../utils/qiniu.js')

// node ./build/gitbook/sync-book-to-qiniu.js $ACCESS_KEY $SECRET_KEY
// Prepare Qiniu configuration options
accessKey = process.argv.slice(2, 3)
secretKey = process.argv.slice(3)

new Qiniu(accessKey, secretKey).uploadFiles('_book/**', {
   strippedPath: '_book/',
   ignoringList: [
      '**/mvc-origin.md',
      '**/package.json',
      '_book/app/**',
      '_book/dist/**',
      '_book/build/**/*'
   ],
   nodir: true
})
