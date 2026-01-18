#!/bin/bash

# AWS EC2 Amazon Linux Docker Setup Script
echo "🚀 Starting deployment on Amazon Linux EC2..."

# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create project directory
mkdir -p /home/ec2-user/ecommerce-app
cd /home/ec2-user/ecommerce-app

echo "✅ Docker and Docker Compose installed successfully!"
echo "📁 Project directory created at /home/ec2-user/ecommerce-app"
echo ""
echo "Next steps:"
echo "1. Upload your project files to this directory"
echo "2. Run: docker-compose up -d"
echo "3. Access your app at http://YOUR-EC2-PUBLIC-IP"