const qiniu  = require("qiniu")
const glob   = require('glob')
const crypto = require('crypto-js')

const bucket = 'mvc-linesh-tw'

function uploadFiles(uploadingPath, options) {
    qiniu.conf.ACCESS_KEY = options.accessKey.toString(crypto.enc.Utf8)
    qiniu.conf.SECRET_KEY = options.secretKey.toString(crypto.enc.Utf8)

    console.log('---------------------------')
    glob.sync(uploadingPath, {
        nodir: options.nodir,
        ignore: options.ignoringList
    }).forEach(filepath => {
        const resourceKey = filepath.substring(options.strippedPath.length, filepath.length)
        // ':' means allow override upload. For further details refer to offical API docs
        console.log(resourceKey)
        const policyToken = new qiniu.rs.PutPolicy(bucket + ":" + resourceKey).token()
        // uploadFile(policyToken, resourceKey, filepath)
    })
}

function uploadFile(uptoken, key, localFile) {
    let extra = new qiniu.io.PutExtra()
    qiniu.io.putFile(uptoken, key, localFile, extra, function(error, response) {
        if(!error) {
            console.log('[Success] File uploaded to 七牛: ' + response.key)
        } else {
            console.error('[error] Something went wrong when uploading file: ' + response.key + '. Error message dumped below: ')
            console.error(error)
        }
    })
}

module.exports = {
    uploadFiles: uploadFiles
}
