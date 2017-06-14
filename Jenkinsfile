pipeline {
    agent any
    tools {
        nodejs 'Node Argon [4.6.0] + mocha, gulp, grunt, jasmine'
    }
    stages {
        stage('build') {
            steps {
                sh 'npm install'
            }
        }
        stage('test') {
            steps {
                sh 'npm test'
            }
        }
        stage('publish test results') {
            steps {
                junit 'junitresults.xml'
                step(
                    [$class: 'CoberturaPublisher',
                    autoUpdateHealth: false,
                    autoUpdateStability: false,
                    coberturaReportFile: 'coverage/cobertura-coverage.xml',
                    failUnhealthy: false,
                    failUnstable: false,
                    maxNumberOfBuilds: 0,
                    onlyStable: false,
                    sourceEncoding: 'ASCII',
                    zoomCoverageChart: false]
                )
            }
        }
        stage('deploy staging to CDN') {
            when {
                branch "staging"
            }
            steps {
                sh 'gulp build:prod'
                sh 'gulp s3-deploy --s3key "AKIAJNPMGIYKGXUK7MQA" \
                    --s3secret "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" \
                    --s3region "us-east-1" \
                    --s3bucket "knobjs-staging"'
            }
        }
        stage('deploy and publish') {
            when {
                branch "master"
            }
            steps {
                sh 'gulp build:prod'
                sh 'gulp s3-deploy --s3key "AKIAJMFBS5UW3UCXF6VQ" \
                    --s3secret "XLxw6ebPG0DqVhG2q89vwafsPgh9oP" \
                    --s3region "us-east-1" \
                    --s3bucket "knobjs-cdn"'
                sh 'npm set init.author.name "edmdesigner-bot"'
                sh 'npm set init.author.email "info@edmdesigner.com"'
                sh 'echo "//registry.npmjs.org/:_authToken=ea72d5e5-e506-4b32-bd53-db1a766df54a" > ~/.npmrc'
                sh 'npm publish'
            }
        }
        stage('clean up') {
            steps {
                cleanWs()
            }
        }

    }
    post {
    	failure {
    		slackSend color: 'danger', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
    	}
    	success {
    slackSend color: 'good', message: "SUCCES: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
    	}
    	unstable {
    slackSend color: 'warning', message: "UNSTABLE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
    	}
    }
}
