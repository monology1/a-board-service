pipeline {
    agent any

    tools {
        nodejs 'NodeJS 20'  // Make sure this matches your NodeJS installation name
    }

    environment {
        DOCKER_REGISTRY = 'your-registry.com'
        DOCKER_IMAGE = 'a-board-backend'
        DOCKER_TAG = "${BRANCH_NAME}-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Tool Install') {
            steps {
                script {
                    sh 'node --version'
                    sh 'npm --version'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Lint & Test') {
            steps {
                sh 'npm run lint'
                // Add tests if available
                // sh 'npm run test'
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'npm run build'
                    // Only run prisma generate if DATABASE_URL is available
                    withCredentials([string(credentialsId: 'database-url', variable: 'DATABASE_URL')]) {
                        sh 'npx prisma generate'
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    sh """
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                    """
                }
            }
        }

        stage('Database Migration') {
            when {
                anyOf {
                    branch 'dev'
                    branch 'prod'
                }
            }
            steps {
                script {
                    withCredentials([string(credentialsId: 'database-url', variable: 'DATABASE_URL')]) {
                        sh 'npx prisma migrate deploy'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'dev') {
                        sh 'docker-compose -f docker-compose.dev.yml up -d'
                    } else if (env.BRANCH_NAME == 'prod') {
                        input message: 'Deploy to production?'
                        sh 'docker-compose -f docker-compose.prod.yml up -d'
                    }
                }
            }
        }
    }

    post {
        always {
            node('any') {  // This ensures FilePath context is available
                cleanWs()
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}