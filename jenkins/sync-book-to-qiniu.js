let qiniu = require("qiniu");
let fs = require('fs');
let glob = require('glob');
let crypto = require('crypto-js')

let qiniukeys = process.argv.slice(2).split(',');

let accessKey = qiniukeys[0];
let secretKey = qiniukeys[1];

console.log('ak: ' + accessKey);
console.log('sk: ' + secretKey);
