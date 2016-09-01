const qiniuUtils = require('../utils/qiniu.js')

// node ./build/official/clear-bucket-before-uploading.js $ACCESS_KEY $SECRET_KEY
// Prepare Qiniu configuration options
accessKey = process.argv.slice(2, 3)
secretKey = process.argv.slice(3)

qiniuUtils.clearBucket({
   accessKey: accessKey,
   secretKey: secretKey,
})
