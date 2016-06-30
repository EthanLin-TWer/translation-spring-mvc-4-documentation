const qiniu  = require("qiniu");
const glob   = require('glob');
const crypto = require('crypto-js')

// node ./jenkins/sync-book-to-qiniu.js $ACCESS_KEY $SECRET_KEY
let qiniuAccessKey = process.argv.slice(2, 3);
let qiniuSecretKey = process.argv.slice(3);

// Prepare Qiniu configuration options
qiniu.conf.ACCESS_KEY = qiniuAccessKey.toString(crypto.enc.Utf8);;
qiniu.conf.SECRET_KEY = qiniuSecretKey.toString(crypto.enc.Utf8);;
bucket = 'mvc-linesh-tw';

glob.sync('_book/**/*.*', {}).forEach(filename => {
    const resource_key_in_qiniu_api = filename.substring('_book/'.length, filename.length);
    // ':' means allow override upload. For further details refer to offical API docs
    const policyToken = new qiniu.rs.PutPolicy(bucket + ":" + resource_key_in_qiniu_api).token();

    uploadFile(policyToken, resource_key_in_qiniu_api, filename)
})

function uploadFile(uptoken, key, localFile) {
    let extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(error, response) {
        if(!error) {
            console.log('[Success] File uploaded: ' + response.key);
        } else {
            console.log(error);
        }
    });
}
