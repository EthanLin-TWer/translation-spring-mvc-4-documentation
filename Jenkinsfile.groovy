node ('main') {
    stage 'Pull latest changes from SCM'
    git([
        url: 'git@github.com:linesh-simplicity/translation-spring-mvc-4-documentation.git',
        branch: 'master'
    ])

    stage 'Download dependencies: Gitbook/Gitbook-cli/Qiniu'
    sh 'npm install'

    stage 'Build book serving directory through Gitbook'
    sh 'gitbook build --gitbook=3.1.1'

    stage 'Upload production _book to Qiniu through their API'
    sh './jenkins/sync-book-to-qiniu.sh'

}
