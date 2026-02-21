pipeline {
    agent any

    

    environment {
        EC2_HOST = '3.109.133.124'
        PROJECT_ROOT = '/home/ubuntu/jenkins-fullstack-project'
        BACKEND_DIR = '/home/ubuntu/jenkins-fullstack-project/backend'

        AWS_DEFAULT_REGION = 'ap-south-1'
        S3_BUCKET = 'food-app-project-frontend'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/SameerSharma004/jenkins-fullstack-project.git'
            }
        }

        // =========================foodapp
        // DEPLOY BACKEND
        // =========================
        stage('Deploy Backend to EC2') {
            steps {
                sshagent(['ec2-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                        cd ${PROJECT_ROOT} &&

                        git pull origin main &&

                        cd backend &&

                        # Fix ownership every time (safe production practice)
                        sudo chown -R ubuntu:ubuntu ${PROJECT_ROOT} &&

                        # Clean install (better than npm install)
                        rm -rf node_modules &&
                        npm ci &&

                        pm2 delete foodapp || true &&
                        pm2 start app.js --name foodapp &&
                        pm2 save
                    '
                    """
                }
            }
        }

        // =========================
        // BUILD FRONTEND
        // =========================
        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

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
                        aws s3 sync frontend/build/ s3://$S3_BUCKET --delete
                    '''
                }
            }
        }
    }
}