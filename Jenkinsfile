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
                withAWS(region:'eu-west-1', credentials:'AWS-staging-user') {
                    s3Upload(file:'dist', bucket:'knob-cdn')
                }
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
