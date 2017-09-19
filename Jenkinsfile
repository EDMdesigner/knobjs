pipeline {
    agent any
    tools {
		nodejs 'Node 6.10.2'
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
        stage('deploy and publish') {
            when {
                branch "master"
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-prod', usernameVariable: 'AWS_KEY', passwordVariable: 'AWS_SECRET')]) {
                    // available as an env variable, but will be masked if you try to print it out any which way
                    sh 'gulp deploy:prod --s3key $AWS_KEY --s3secret $AWS_SECRET --s3region us-east-1 --s3bucket edmdesigner-cdn'
                }
                withNPM(npmrcConfig:'npmrc-global') {
                    sh 'npm publish'
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
        failure {
            slackSend color: 'danger', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
        }
        success {
            slackSend color: 'good', message: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
        }
        unstable {
            slackSend color: 'warning', message: "UNSTABLE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
        }
    }
}
