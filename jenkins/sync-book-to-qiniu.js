const qiniu  = require("qiniu");
const glob   = require('glob');
const crypto = require('crypto-js')

// node ./jenkins/sync-book-to-qiniu.js $ACCESS_KEY $SECRET_KEY
let qiniuAccessKey = process.argv.slice(2, 3);
let qiniuSecretKey = process.argv.slice(3);

qiniu.conf.ACCESS_KEY = qiniuAccessKey.toString(crypto.enc.Utf8);;
qiniu.conf.SECRET_KEY = qiniuSecretKey.toString(crypto.enc.Utf8);;
bucket = 'mvc-linesh-tw';

const uploadingBookDirectoryFiles = glob.sync('_book/**/*.*', {})

uploadingBookDirectoryFiles.forEach(filename => {
    const resource_key_in_qiniu_api = filename.substring('_book/'.length, filename.length);

    const policyToken = new qiniu.rs.PutPolicy(bucket + ":" + resource_key_in_qiniu_api).token();
    uploadFile(policyToken, resource_key_in_qiniu_api, filename)
})

function policyToken(bucket, key) {
  return new qiniu.rs.PutPolicy(bucket + ":" + key).token(); // ':' means allow override upload
}

//构造上传函数
function uploadFile(uptoken, key, localFile) {
    var extra = new qiniu.io.PutExtra();
    console.log('------------- Uploading file -------------')
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        console.log('=====================Upload Success======================');
        console.log(ret.hash, ret.key, ret.persistentId);
      } else {
        // 上传失败， 处理返回代码
        console.log('==========================Boom===========================');
        console.log(err);
      }
    });
}
