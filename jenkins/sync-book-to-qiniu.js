let qiniu = require("qiniu");
let fs = require('fs');
let glob = require('glob');
let crypto = require('crypto-js')

let encryptedAccessKeyFromPipeline = process.argv.slice(2, 3);
let encryptedSecretKeyFromPipeline = process.argv.slice(3, 4);
let encryptor = process.argv.slice(4);

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = decrypt(crypto, encryptedAccessKeyFromPipeline, encryptor);
qiniu.conf.SECRET_KEY = decrypt(crypto, encryptedSecretKeyFromPipeline, encryptor);
bucket = 'mvc-linesh-tw';

function decrypt(crypto, qiniu_key, encrytpor) {
    return crypto.AES.decrypt(qiniu_key, encryptor).toString(crypto.enc.Utf8);
}

console.log('QINIU_ACCESS_KEY: ' + qiniu.conf.ACCESS_KEY);
console.log('QINIU_SECRET_KEY: ' + qiniu.conf.SECRET_KEY);
console.log('ENCRYPTOR: ' + encryptor);
