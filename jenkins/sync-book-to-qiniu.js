let qiniu = require("qiniu");
let fs = require('fs');
let glob = require('glob');
let crypto = require('crypto-js')

let accessKey = process.argv.slice(2, 3);
let secretKey = process.argv.slice(3);

console.log('ak: ' + accessKey);
console.log('sk: ' + secretKey);
