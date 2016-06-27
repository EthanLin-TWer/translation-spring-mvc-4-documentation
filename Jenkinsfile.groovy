node ('main') {
    stage 'Pull latest changes from SCM'
    git([
        url: 'git@github.com:linesh-simplicity/translation-spring-mvc-4-documentation.git',
        branch: 'master'
    ])

    stage 'Download dependencies: Gitbook & Gitbook command line'
    sh 'npm install'

    stage 'Build book serving directory through Gitbook'
    sh 'gitbook build --gitbook=3.1.1'
    sh 'tree'
}
