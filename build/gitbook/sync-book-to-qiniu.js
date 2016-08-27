const qiniu  = require("qiniu");
const glob   = require('glob');
const crypto = require('crypto-js')

const ignoredFiles = [
    '.travis.yml',
    'sync-book-to-qiniu.js',
    'sync-book-to-qiniu.sh',
    'mvc-origin.md',
    'package.json'
];

// node ./build/gitbook/sync-book-to-qiniu.js $ACCESS_KEY $SECRET_KEY
// Prepare Qiniu configuration options
qiniu.conf.ACCESS_KEY = process.argv.slice(2, 3).toString(crypto.enc.Utf8);
qiniu.conf.SECRET_KEY = process.argv.slice(3).toString(crypto.enc.Utf8);
const bucket = 'mvc-linesh-tw';

glob.sync('_book/**/*.*', {}).filter(filename => {
    for (let ignored of ignoredFiles) {
        if (filename.endsWith(ignored)) return false;
    }
    return true;
}).forEach(filepath => {
    const resource_key_in_qiniu_api = filepath.substring('_book/'.length, filepath.length);
    // ':' means allow override upload. For further details refer to offical API docs
    const policyToken = new qiniu.rs.PutPolicy(bucket + ":" + resource_key_in_qiniu_api).token();
    uploadFile(policyToken, resource_key_in_qiniu_api, filepath)
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
