# !/bin/sh

node ./jenkins/sync-book-to-qiniu.js $ACCESS_KEY $SECRET_KEY $ENCRYPTOR

pwd
tree -L 3
