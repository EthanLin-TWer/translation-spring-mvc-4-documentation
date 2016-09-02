const qiniu  = require("qiniu")
const glob   = require('glob')
const crypto = require('crypto-js')
const client = new qiniu.rs.Client()
const qiniuExtend = qiniu.rsf

class QiniuUtil {
   constructor(accessKey, secretKey) {
      this.accessKey = accessKey
      this.secretKey = secretKey
      this.bucket = 'mvc-linesh-tw'

      qiniu.conf.ACCESS_KEY = this.accessKey.toString(crypto.enc.Utf8)
      qiniu.conf.SECRET_KEY = this.secretKey.toString(crypto.enc.Utf8)
   }

   uploadFiles(uploadingPath, options) {
      console.log('---------------------------')
      glob.sync(uploadingPath, {
         nodir: options.nodir,
         ignore: options.ignoringList
      }).forEach(filepath => {
         const resourceKey = filepath.substring(options.strippedPath.length, filepath.length)
         // ':' means allow override upload. For further details refer to offical API docs
         const policyToken = new qiniu.rs.PutPolicy(this.bucket + ":" + resourceKey).token()
         uploadFileInternal(policyToken, resourceKey, filepath)
      })
   }

   clearBucket(options) {
      console.log('---------------------------')
      qiniuExtend.listPrefix(this.bucket, '', '', '', '', (error, response) => {
         if (error) {
            errorLog('listing all resource in bucket', this.bucket, error)
            return ;
         }

         console.log('Listing all resources currently in qiniu bucket: ')
         console.log(response.items.map(item => item.key))
         response.items.map(item => item.key).forEach(resource => {
            client.remove(this.bucket, resource, (error) => {
               console.log('[Delete] Origin resouce removed successfully: ' + resource)
            })
         })
      })
   }
}

function uploadFileInternal(uptoken, key, localFile) {
   let extra = new qiniu.io.PutExtra()
   qiniu.io.putFile(uptoken, key, localFile, extra, function(error, response) {
      if (error) {
         errorLog('uploading file', response.key, error)
         return ;
      }

      console.log('[Success] File uploaded to 七牛: ' + response.key)
    })
}

function errorLog(event, resource, error) {
   console.error('[error] Something went wrong when ' + event + ': ' + resource + '. Error message dumped below:')
   console.error(error)
}

module.exports = QiniuUtil
