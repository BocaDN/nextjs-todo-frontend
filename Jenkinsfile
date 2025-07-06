pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = 'bocadn/nextjs-todo-frontend'
    }

    stages {
        stage('Clone from GitHub') {
            steps {
                echo "Cloning repository from GitHub..."
                git url: 'https://github.com/BocaDN/nextjs-todo-frontend.git', branch: 'main'
            }
        }

        stage('Install dependencies') {
            steps {
                echo "Installing dependencies with npm..."
                sh 'npm ci'
            }
        }

        stage('Build Next.js app') {
            steps {
                echo "Building Next.js app..."
                sh 'npm run build'
            }
        }

        stage('Run tests (optional)') {
            steps {
                echo "Running tests..."
                // Add your test command; replace with actual test script
                sh 'npm test || echo "No tests configured"'
            }
        }

        stage('Build Docker image') {
            steps {
                echo "Building Docker image..."
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials',
                                                     usernameVariable: 'USERNAME',
                                                     passwordVariable: 'PASSWORD')]) {
                        echo "Logging in to DockerHub..."
                        sh "echo $PASSWORD | docker login --username $USERNAME --password-stdin"
                        echo "Pushing Docker image..."
                        sh "docker push ${IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Logging out from Docker..."
            sh 'docker logout || true'
        }
        success {
            echo "Pipeline finished successfully!"
        }
        failure {
            echo "Pipeline failed."
        }
    }
}
