const qiniu    = require("qiniu")
const glob     = require('glob')
const crypto   = require('crypto-js')
const qiniuIO  = qiniu.io
const qiniuRs  = qiniu.rs
const qiniuRsf = qiniu.rsf
const client   = new qiniuRs.Client()

class Qiniu {
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
         const policyToken = new qiniuRs.PutPolicy(this.bucket + ":" + resourceKey).token()
         uploadFileInternal(policyToken, resourceKey, filepath)
      })
   }

   clearBucket() {
      console.log('---------------------------')
      qiniuRsf.listPrefix(this.bucket, '', '', '', '', (error, response) => {
         if (error) {
            errorLog('listing all resource in bucket', this.bucket, error)
            return ;
         }

         console.log('Listing all resources currently in qiniu bucket: ')
         console.log(response.items.map(item => item.key))
         response.items.map(item => item.key).forEach(resource => {
            client.remove(this.bucket, resource, (error) => {
               console.log('[Delete] Origin resource removed successfully: ' + resource)
            })
         })
      })
   }
}

function uploadFileInternal(uptoken, key, file) {
   qiniuIO.putFile(uptoken, key, file, new qiniuIO.PutExtra(), (error, response) => {
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

module.exports = Qiniu
