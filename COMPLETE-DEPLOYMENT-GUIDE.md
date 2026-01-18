# 🚀 Complete Step-by-Step Deployment Guide

## 📋 Table of Contents
1. [Project Understanding](#project-understanding)
2. [Local Development Setup](#local-development-setup)
3. [AWS EC2 Setup](#aws-ec2-setup)
4. [Production Deployment](#production-deployment)
5. [Testing & Verification](#testing-verification)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Understanding

### What is this project?
Ye ek **real-world e-commerce application** hai jo **microservices architecture** use karti hai. Isme 5 different services hain:

1. **Frontend (React.js)** - User interface
2. **Backend (Node.js)** - API server
3. **MongoDB** - Database for storing products
4. **Redis** - Caching layer for fast responses
5. **Nginx** - Reverse proxy and load balancer

### Why Docker?
- **Consistency**: Same environment everywhere
- **Scalability**: Easy to scale services
- **Isolation**: Each service runs independently
- **Portability**: Works on any system

---

## 🖥️ Local Development Setup

### Step 1: Prerequisites Check
```bash
# Check if Docker is installed
docker --version
# Expected output: Docker version 20.x.x

# Check if Docker Compose is installed
docker-compose --version
# Expected output: docker-compose version 1.x.x
```

**If not installed:**
- **Windows**: Download Docker Desktop from docker.com
- **Mac**: Download Docker Desktop from docker.com
- **Linux**: 
  ```bash
  sudo apt update
  sudo apt install docker.io docker-compose
  ```

### Step 2: Project Directory Setup
```bash
# Navigate to your project folder
cd "c:\mahesh workpace\projct aws devops\docker\project 1"

# Check if all files are present
dir
# You should see:
# - docker-compose.yml
# - docker-compose.prod.yml
# - frontend/ folder
# - backend/ folder
# - nginx/ folder
# - mongo-init/ folder
```

### Step 3: Understanding Docker Compose File
```yaml
# docker-compose.yml breakdown:

version: '3.8'  # Docker Compose version

services:
  frontend:     # React.js service
    build: ./frontend     # Build from frontend folder
    ports: "3000:3000"   # Map port 3000 to host
    depends_on: backend  # Wait for backend to start
    
  backend:      # Node.js API service
    build: ./backend     # Build from backend folder
    ports: "5000:5000"   # Map port 5000 to host
    depends_on:          # Wait for these services
      - mongodb
      - redis
      
  mongodb:      # Database service
    image: mongo:5.0     # Use official MongoDB image
    ports: "27017:27017" # Map MongoDB port
    volumes:             # Persistent storage
      - mongo-data:/data/db
      
  redis:        # Cache service
    image: redis:7-alpine # Use Redis Alpine image
    ports: "6379:6379"    # Map Redis port
    
  nginx:        # Reverse proxy
    build: ./nginx       # Build from nginx folder
    ports: "80:80"       # Map port 80 to host
    depends_on:          # Wait for frontend and backend
      - frontend
      - backend
```

### Step 4: Start Local Development
```bash
# Start all services in background
docker-compose up -d

# What happens:
# 1. Docker builds images for frontend, backend, nginx
# 2. Downloads MongoDB and Redis images
# 3. Creates network for services to communicate
# 4. Starts all containers
# 5. Sets up volumes for data persistence
```

### Step 5: Verify Local Setup
```bash
# Check if all containers are running
docker-compose ps
# Expected output:
# NAME                    STATUS
# project1_frontend_1     Up
# project1_backend_1      Up
# project1_mongodb_1      Up
# project1_redis_1        Up
# project1_nginx_1        Up

# Check logs
docker-compose logs -f
# This shows real-time logs from all services
```

### Step 6: Test Local Application
```bash
# Open browser and go to:
http://localhost

# Test API directly:
curl http://localhost/health
# Expected: {"status":"OK","service":"Backend API"}

curl http://localhost/api/products
# Expected: JSON array of products
```

---

## ☁️ AWS EC2 Setup (Detailed)

### Step 1: AWS Account Setup
1. **Login to AWS Console**: https://aws.amazon.com/console/
2. **Go to EC2 Dashboard**: Services → EC2
3. **Check your region**: Top-right corner (e.g., us-east-1)

### Step 2: Create Key Pair
```bash
# In EC2 Dashboard:
1. Click "Key Pairs" in left sidebar
2. Click "Create key pair"
3. Name: "ecommerce-key"
4. Type: RSA
5. Format: .pem (for SSH)
6. Click "Create key pair"
7. Download and save the .pem file securely
```

### Step 3: Launch EC2 Instance (Detailed)
```bash
# In EC2 Dashboard:
1. Click "Launch Instance"

2. Choose AMI:
   - Select "Amazon Linux 2 AMI (HVM)"
   - Architecture: x86_64

3. Choose Instance Type:
   - Select "t2.micro" (Free tier eligible)
   - vCPUs: 1, Memory: 1 GiB

4. Configure Instance:
   - Number of instances: 1
   - Network: Default VPC
   - Subnet: Default
   - Auto-assign Public IP: Enable

5. Add Storage:
   - Size: 8 GiB (default)
   - Volume Type: gp2

6. Add Tags:
   - Key: Name
   - Value: Ecommerce-Server

7. Configure Security Group:
   - Create new security group
   - Name: ecommerce-sg
   - Rules:
     * SSH (22) - Source: My IP
     * HTTP (80) - Source: 0.0.0.0/0
     * HTTPS (443) - Source: 0.0.0.0/0

8. Review and Launch:
   - Select existing key pair: ecommerce-key
   - Check acknowledgment
   - Click "Launch Instances"
```

### Step 4: Connect to EC2
```bash
# Wait for instance to be "running"
# Note down the Public IPv4 address (e.g., 3.15.123.45)

# From your local machine:
# Windows (use Git Bash or WSL):
ssh -i "path/to/ecommerce-key.pem" ec2-user@3.15.123.45

# Mac/Linux:
chmod 400 ecommerce-key.pem
ssh -i "ecommerce-key.pem" ec2-user@3.15.123.45

# If successful, you'll see:
[ec2-user@ip-172-31-x-x ~]$
```

---

## 🚀 Production Deployment (Step by Step)

### Step 1: Setup Docker on EC2
```bash
# Update system packages
sudo yum update -y
# This updates all installed packages

# Install Docker
sudo yum install -y docker
# Installs Docker engine

# Start Docker service
sudo systemctl start docker
# Starts Docker daemon

# Enable Docker to start on boot
sudo systemctl enable docker
# Auto-starts Docker when EC2 reboots

# Add ec2-user to docker group (to run docker without sudo)
sudo usermod -a -G docker ec2-user
# Adds user to docker group

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# Downloads Docker Compose binary

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose
# Gives execute permission

# Verify installation
docker --version
docker-compose --version

# IMPORTANT: Logout and login again for group changes
exit
ssh -i "ecommerce-key.pem" ec2-user@YOUR-EC2-IP
```

### Step 2: Upload Project Files
```bash
# From your local machine (new terminal):
# Navigate to project directory
cd "c:\mahesh workpace\projct aws devops\docker\project 1"

# Upload entire project to EC2
scp -i "ecommerce-key.pem" -r . ec2-user@YOUR-EC2-IP:/home/ec2-user/ecommerce-app/

# What this does:
# -i: specifies key file
# -r: recursive (copies folders)
# .: current directory (all files)
# Destination: /home/ec2-user/ecommerce-app/
```

### Step 3: Configure Production Environment
```bash
# SSH back to EC2
ssh -i "ecommerce-key.pem" ec2-user@YOUR-EC2-IP

# Go to project directory
cd /home/ec2-user/ecommerce-app

# List files to verify upload
ls -la
# You should see all project files

# Update production config with your actual EC2 IP
# Replace YOUR-EC2-PUBLIC-IP with actual IP (e.g., 3.15.123.45)
sed -i 's/YOUR-EC2-PUBLIC-IP/3.15.123.45/g' docker-compose.prod.yml

# Verify the change
grep "REACT_APP_API_URL" docker-compose.prod.yml
# Should show: REACT_APP_API_URL=http://3.15.123.45
```

### Step 4: Deploy Production Services
```bash
# Start production deployment
docker-compose -f docker-compose.prod.yml up -d

# What happens:
# 1. Builds Docker images for frontend, backend, nginx
# 2. Downloads MongoDB and Redis images
# 3. Creates production network
# 4. Starts all containers with restart policies
# 5. Sets up persistent volumes

# Monitor the deployment
docker-compose -f docker-compose.prod.yml logs -f

# Wait for all services to start (look for these messages):
# - "MongoDB connected"
# - "Redis connected"
# - "Backend server running on port 5000"
# - "webpack compiled successfully" (frontend)
```

### Step 5: Verify Production Deployment
```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps
# All services should show "Up"

# Check individual container logs
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs nginx

# Test health endpoint
curl http://localhost/health
# Should return: {"status":"OK","service":"Backend API"}

# Check if MongoDB has sample data
curl http://localhost/api/products
# Should return array of sample products
```

---

## 🧪 Testing & Verification

### Step 1: Browser Testing
```bash
# Open browser and navigate to:
http://YOUR-EC2-PUBLIC-IP

# You should see:
# - E-commerce Dashboard
# - Form to add products
# - List of existing products (3 sample products)
```

### Step 2: API Testing
```bash
# From EC2 terminal or your local machine:

# Health check
curl http://YOUR-EC2-IP/health

# Get all products
curl http://YOUR-EC2-IP/api/products

# Add a new product
curl -X POST http://YOUR-EC2-IP/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Laptop",
    "price": 50000,
    "description": "High-performance laptop",
    "category": "Electronics",
    "stock": 5
  }'

# Verify new product was added
curl http://YOUR-EC2-IP/api/products
```

### Step 3: Performance Testing
```bash
# Check container resource usage
docker stats

# Check system resources
free -h  # Memory usage
df -h    # Disk usage
top      # CPU usage
```

---

## 🔧 Troubleshooting Guide

### Common Issue 1: Container Won't Start
```bash
# Check logs for specific service
docker-compose logs backend

# Common solutions:
# 1. Port already in use
sudo netstat -tulpn | grep :5000
sudo kill -9 <PID>

# 2. Rebuild container
docker-compose up --build backend

# 3. Remove and recreate
docker-compose down
docker-compose up -d
```

### Common Issue 2: Can't Access from Browser
```bash
# Check security group:
# 1. Go to EC2 → Security Groups
# 2. Find your security group
# 3. Ensure port 80 is open to 0.0.0.0/0

# Check if nginx is running
docker-compose ps nginx

# Check nginx logs
docker-compose logs nginx
```

### Common Issue 3: Database Connection Issues
```bash
# Check MongoDB container
docker-compose logs mongodb

# Check if MongoDB is accessible
docker exec -it <mongodb-container-id> mongo
# Inside MongoDB shell:
show dbs
use ecommerce
db.products.find()
```

### Common Issue 4: Redis Connection Issues
```bash
# Check Redis container
docker-compose logs redis

# Test Redis connection
docker exec -it <redis-container-id> redis-cli
# Inside Redis CLI:
ping  # Should return PONG
keys *  # Shows cached keys
```

---

## 📊 Monitoring & Maintenance

### Daily Monitoring
```bash
# Check all containers status
docker-compose ps

# Check resource usage
docker stats

# Check logs for errors
docker-compose logs --tail=50

# Check disk space
df -h
```

### Weekly Maintenance
```bash
# Update system packages
sudo yum update -y

# Clean up unused Docker resources
docker system prune -f

# Backup database (if needed)
docker exec <mongodb-container> mongodump --out /backup
```

### Scaling (if needed)
```bash
# Scale backend service to 3 instances
docker-compose up -d --scale backend=3

# Check scaled services
docker-compose ps
```

---

## 🔐 Security Best Practices

### 1. Change Default Secrets
```bash
# Edit docker-compose.prod.yml
nano docker-compose.prod.yml

# Change:
JWT_SECRET=your-production-secret-key-change-this
# To:
JWT_SECRET=your-very-strong-secret-key-here-123456789
```

### 2. Enable MongoDB Authentication
```bash
# Add to docker-compose.prod.yml under mongodb service:
environment:
  - MONGO_INITDB_ROOT_USERNAME=admin
  - MONGO_INITDB_ROOT_PASSWORD=strongpassword123

# Update backend MONGO_URI:
MONGO_URI=mongodb://admin:strongpassword123@mongodb:27017/ecommerce?authSource=admin
```

### 3. Setup SSL/HTTPS (Optional)
```bash
# Install Certbot
sudo yum install -y certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx config to use SSL
```

---

## 🎯 Success Indicators

### ✅ Local Development Success
- All 5 containers running (`docker-compose ps`)
- Application accessible at `http://localhost`
- API responding at `http://localhost/health`
- Can add and view products

### ✅ Production Deployment Success
- EC2 instance running and accessible
- All containers running on EC2
- Application accessible at `http://YOUR-EC2-IP`
- API responding at `http://YOUR-EC2-IP/health`
- Database persisting data
- Redis caching working

### ✅ Performance Success
- Page load time < 3 seconds
- API response time < 500ms
- All containers using < 80% resources
- No error logs in containers

---

## 📞 Next Steps

1. **Domain Setup**: Point your domain to EC2 IP
2. **SSL Certificate**: Setup HTTPS with Let's Encrypt
3. **CI/CD Pipeline**: Automate deployments with GitHub Actions
4. **Monitoring**: Add Prometheus and Grafana
5. **Backup Strategy**: Automated database backups
6. **Load Balancer**: Add AWS Application Load Balancer for high availability

---

**🎉 Congratulations! You have successfully deployed a production-ready microservices application!**