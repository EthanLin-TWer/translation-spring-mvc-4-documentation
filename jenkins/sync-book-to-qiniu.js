const qiniu = require("qiniu");
const fs = require('fs');
const glob = require('glob');
const crypto = require('crypto-js')

let encryptedAccessKeyFromPipeline = process.argv.slice(2, 3);
let encryptedSecretKeyFromPipeline = process.argv.slice(3, 4);
let encryptor = process.argv.slice(4);

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = crypto.AES.decrypt(encryptedAccessKeyFromPipeline, encryptor).toString(crypto.enc.Utf8);
qiniu.conf.SECRET_KEY = crypto.AES.decrypt(encryptedSecretKeyFromPipeline, encryptor).toString(crypto.enc.Utf8);
bucket = 'mvc-linesh-tw';

console.log('QINIU_ACCESS_KEY: ' + qiniu.conf.ACCESS_KEY);
console.log('QINIU_SECRET_KEY: ' + qiniu.conf.SECRET_KEY);
console.log('ENCRYPTOR: ' + encryptor);
