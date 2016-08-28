const qiniu  = require("qiniu")
const glob   = require('glob')
const crypto = require('crypto-js')

// node ./build/official/sync-book-to-qiniu.js $ACCESS_KEY $SECRET_KEY
// Prepare Qiniu configuration options
qiniu.conf.ACCESS_KEY = process.argv.slice(2, 3).toString(crypto.enc.Utf8);
qiniu.conf.SECRET_KEY = process.argv.slice(3).toString(crypto.enc.Utf8);
const bucket = 'mvc-linesh-tw';

console.log('---------------------------')
glob.sync('dist/**', { nodir: true, ignore: 'dist/build/**' }).forEach(filepath => {
    const resource_key_in_qiniu_api = filepath.substring('dist/'.length, filepath.length);
    // console.log(resource_key_in_qiniu_api);
    // ':' means allow override upload. For further details refer to offical API docs
    const policyToken = new qiniu.rs.PutPolicy(bucket + ":" + resource_key_in_qiniu_api).token();
    uploadFile(policyToken, resource_key_in_qiniu_api, filepath)
})

function uploadFile(uptoken, key, localFile) {
    let extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(error, response) {
        if(!error) {
            console.log('[Success] File uploaded to 七牛: ' + response.key);
        } else {
            console.log(error);
        }
    });
}
