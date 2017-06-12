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
        stage('deploy to CDN') {
            steps {
                sh 'gulp build:prod'
                sh 'gulp s3-deploy --s3key "AKIAJNPMGIYKGXUK7MQA" \
                    --s3secret "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" \
                    --s3region "us-east-1" \
                    --s3bucket "knobjs-staging"'
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
