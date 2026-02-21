pipeline {
    agent any

    tools {
        nodejs 'node18'   // Must match Global Tool Configuration name
    }

    environment {
        EC2_HOST = '3.109.133.124'
        PROJECT_ROOT = '/home/ubuntu/jenkins-fullstack-project'
        BACKEND_DIR = '/home/ubuntu/jenkins-fullstack-project/backend'

        AWS_DEFAULT_REGION = 'ap-south-1'
        S3_BUCKET = 'food-app-project-frontend'
    }

    stages {

        // =========================
        // CHECKOUT CODE
        // =========================
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/SameerSharma004/jenkins-fullstack-project.git'
            }
        }

        // =========================
        // DEPLOY BACKEND TO EC2
        // =========================
        stage('Deploy Backend to EC2') {
            steps {
                sshagent(['ec2-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                        set -e

                        cd ${PROJECT_ROOT} &&
                        git pull origin main &&

                        cd backend &&

                        # Ensure correct ownership
                        sudo chown -R ubuntu:ubuntu ${PROJECT_ROOT} &&

                        # Clean dependency install
                        rm -rf node_modules &&
                        npm ci &&

                        # Restart application
                        pm2 delete foodapp || true &&
                        pm2 start app.js --name foodapp &&
                        pm2 save
                    '
                    """
                }
            }
        }

        // =========================
        // INSTALL FRONTEND DEPENDENCIES
        // =========================
        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        // =========================
        // BUILD FRONTEND
        // =========================
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        // =========================
        // DEPLOY FRONTEND TO S3
        // =========================
        stage('Deploy Frontend to S3') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-s3-creds'
                ]]) {
                    sh '''
                        aws s3 sync frontend/build/ s3://$S3_BUCKET --delete --region $AWS_DEFAULT_REGION
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}