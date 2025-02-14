pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'your-registry.com'
        DOCKER_IMAGE = 'a-board-backend'
        DOCKER_TAG = "${BRANCH_NAME}-${BUILD_NUMBER}"
        DATABASE_URL = credentials('database-url')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
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
                sh 'npm run build'
                sh 'npx prisma generate'
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        def customImage = docker.build("${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}")
                        customImage.push()

                        if (env.BRANCH_NAME == 'prod') {
                            customImage.push('latest')
                        }
                    }
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
            cleanWs()
        }
    }
}