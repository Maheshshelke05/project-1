# 🛒 E-commerce Microservices Docker Project

**Server IP: 13.233.143.170** ✅ (Already Configured)

Complete production-ready e-commerce application with microservices architecture for AWS EC2 deployment.

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Explanation](#architecture-explanation)
3. [File Structure & Explanation](#file-structure--explanation)
4. [Docker Files Explained](#docker-files-explained)
5. [Docker Compose Files Explained](#docker-compose-files-explained)
6. [AWS EC2 Deployment Guide](#aws-ec2-deployment-guide)
7. [Commands Explanation](#commands-explanation)
8. [Testing & Verification](#testing--verification)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

### What is this project?
He ek **real-world e-commerce application** ahe jo **microservices architecture** use karte. Yat 5 different services ahet:

1. **Frontend (React.js)** - User interface for product management
2. **Backend (Node.js/Express)** - REST API server
3. **MongoDB** - Database for storing products
4. **Redis** - Caching layer for fast API responses
5. **Nginx** - Reverse proxy and load balancer

### Application Screenshots
![E-commerce Dashboard](img/Screenshot%202026-01-18%20181346.png)
*E-commerce Dashboard - Main Application Interface*

![Product Management](img/Screenshot%202026-01-18%20181358.png)
*Product Management - Add/View Products*

### Why Microservices?
- **Scalability**: Each service can scale independently
- **Maintainability**: Easy to update individual services
- **Fault Tolerance**: If one service fails, others continue working
- **Technology Diversity**: Each service can use different technologies

---

## 🏗️ Architecture Explanation

```
┌─────────────────┐
│   User Browser  │
└─────────┬───────┘
          │ HTTP Request
          ▼
┌─────────────────┐    Port 80
│  Nginx Proxy    │◄─────────────── External Traffic
│  (Load Balancer)│
└─────────┬───────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌─────────┐ ┌─────────┐
│Frontend │ │Backend  │
│React.js │ │Node.js  │
│Port 3000│ │Port 5000│
└─────────┘ └─────┬───┘
                  │
            ┌─────┴─────┐
            ▼           ▼
      ┌─────────┐ ┌─────────┐
      │ MongoDB │ │  Redis  │
      │Port     │ │Port     │
      │27017    │ │6379     │
      └─────────┘ └─────────┘
```

## 📊 Container & Image Details

### Total Containers: **5**
### Total Images: **5** (3 Custom + 2 Official)

| Service | Container Name | Image Type | Base Image | Port | Size |
|---------|---------------|------------|------------|------|------|
| Frontend | `project1_frontend_1` | Custom Build | `node:18-alpine` | 3000 | ~150MB |
| Backend | `project1_backend_1` | Custom Build | `node:18-alpine` | 5000 | ~120MB |
| Nginx | `project1_nginx_1` | Custom Build | `nginx:alpine` | 80 | ~25MB |
| MongoDB | `project1_mongodb_1` | Official | `mongo:5.0` | 27017 | ~700MB |
| Redis | `project1_redis_1` | Official | `redis:7-alpine` | 6379 | ~15MB |

**Total Memory Usage: ~1GB**

## 🔗 Service Connections & Communication

### Connection Flow:
```
User Browser (Port 80)
    ↓
Nginx Container (nginx:alpine)
    ├── Route: / → Frontend Container (node:18-alpine)
    ├── Route: /api/ → Backend Container (node:18-alpine)
    └── Route: /health → Backend Container

Backend Container
    ├── Database → MongoDB Container (mongo:5.0)
    └── Cache → Redis Container (redis:7-alpine)
```

### Who Calls Whom:
1. **User** → **Nginx** (Port 80)
2. **Nginx** → **Frontend** (Port 3000) for UI requests
3. **Nginx** → **Backend** (Port 5000) for API requests
4. **Frontend** → **Backend** (via Nginx) for data
5. **Backend** → **MongoDB** (Port 27017) for database operations
6. **Backend** → **Redis** (Port 6379) for caching

### Network Communication:
- **External Network**: `ecommerce-network` (Bridge driver)
- **Internal DNS**: Containers communicate using service names
- **Volume Sharing**: MongoDB and Redis use persistent volumes

---

## 📁 File Structure & Explanation

```
ecommerce-microservices/
├── 📄 docker-compose.yml          # Development environment
├── 📄 docker-compose.prod.yml     # Production environment (IP: 13.233.143.170)
├── 📄 deploy-ec2.sh              # EC2 setup automation script
├── 📄 README.md                  # This documentation
├── 📄 Makefile                   # Helper commands
├── 📄 .env                       # Environment variables
│
├── 📁 frontend/                  # React.js Application
│   ├── 📄 Dockerfile            # Frontend container instructions
│   ├── 📄 package.json          # Node.js dependencies
│   ├── 📁 public/
│   │   └── 📄 index.html        # HTML template
│   └── 📁 src/
│       ├── 📄 App.js            # Main React component
│       └── 📄 index.js          # React entry point
│
├── 📁 backend/                   # Node.js API Server
│   ├── 📄 Dockerfile            # Backend container instructions
│   ├── 📄 package.json          # Node.js dependencies
│   └── 📄 server.js             # Express server code
│
├── 📁 nginx/                     # Reverse Proxy
│   ├── 📄 Dockerfile            # Nginx container instructions
│   └── 📄 nginx.conf            # Nginx configuration
│
└── 📁 mongo-init/               # Database Initialization
    └── 📄 init.js               # Sample data insertion
```

---

## 🐳 Docker Files Explained

### 1. Frontend Dockerfile
```dockerfile
FROM node:18-alpine              # Base image: Node.js 18 on Alpine Linux
                                 # Alpine = Lightweight Linux (5MB vs 100MB+)

WORKDIR /app                     # Set working directory inside container

COPY package*.json ./            # Copy package.json and package-lock.json
RUN npm install                  # Install Node.js dependencies

COPY . .                         # Copy all source code

EXPOSE 3000                      # Document that container uses port 3000

CMD ["npm", "start"]             # Command to run when container starts
```

**Explanation:**
- **FROM**: Base image - Node.js 18 on Alpine Linux (small & secure)
- **WORKDIR**: Sets `/app` as working directory
- **COPY package*.json**: Copies dependency files first (Docker layer caching)
- **RUN npm install**: Installs all dependencies
- **COPY . .**: Copies all source code
- **EXPOSE 3000**: Documents port usage (not actually opens port)
- **CMD**: Default command when container starts

### 2. Backend Dockerfile
```dockerfile
FROM node:18-alpine              # Same base image for consistency

WORKDIR /app                     # Working directory

COPY package*.json ./            # Copy dependency files
RUN npm install --production     # Install only production dependencies
                                 # (excludes devDependencies)

COPY . .                         # Copy source code

EXPOSE 5000                      # API server port

CMD ["npm", "start"]             # Start Express server
```

**Key Differences:**
- `--production` flag: Only installs production dependencies (smaller image)
- Port 5000: API server port

### 3. Nginx Dockerfile
```dockerfile
FROM nginx:alpine                # Official Nginx on Alpine Linux

COPY nginx.conf /etc/nginx/conf.d/default.conf
                                 # Replace default config with our config

EXPOSE 80                        # HTTP port
```

**Explanation:**
- **nginx:alpine**: Official Nginx image (lightweight)
- **COPY nginx.conf**: Replaces default configuration
- **EXPOSE 80**: Standard HTTP port

---

## 📝 Docker Compose Files Explained

### 1. docker-compose.yml (Development)
```yaml
version: '3.8'                   # Docker Compose file format version

services:                        # Define all services
  frontend:                      # Service name
    build: ./frontend            # Build from Dockerfile in ./frontend
    ports:                       # Port mapping
      - "3000:3000"              # Host:Container
    depends_on:                  # Wait for these services
      - backend
    environment:                 # Environment variables
      - REACT_APP_API_URL=http://localhost:5000
    networks:                    # Connect to custom network
      - ecommerce-network

  backend:
    build: ./backend             # Build from ./backend/Dockerfile
    ports:
      - "5000:5000"              # API port mapping
    depends_on:                  # Dependencies
      - mongodb
      - redis
    environment:
      - MONGO_URI=mongodb://mongodb:27017/ecommerce
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-secret-key
    networks:
      - ecommerce-network

  mongodb:                       # Database service
    image: mongo:5.0             # Use official MongoDB image
    ports:
      - "27017:27017"            # MongoDB port
    volumes:                     # Persistent storage
      - mongo-data:/data/db      # Named volume
    networks:
      - ecommerce-network

  redis:                         # Cache service
    image: redis:7-alpine        # Official Redis on Alpine
    ports:
      - "6379:6379"              # Redis port
    networks:
      - ecommerce-network

  nginx:                         # Reverse proxy
    build: ./nginx               # Build from ./nginx/Dockerfile
    ports:
      - "80:80"                  # HTTP port
    depends_on:
      - frontend
      - backend
    networks:
      - ecommerce-network

volumes:                         # Named volumes
  mongo-data:                    # Persistent MongoDB data

networks:                        # Custom networks
  ecommerce-network:             # Internal network for services
    driver: bridge               # Bridge network driver
```

### 2. docker-compose.prod.yml (Production)
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    restart: unless-stopped      # Auto-restart policy
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://13.233.143.170  # Your EC2 IP
    networks:
      - ecommerce-network

  backend:
    build: ./backend
    restart: unless-stopped      # Auto-restart on failure
    depends_on:
      - mongodb
      - redis
    environment:
      - MONGO_URI=mongodb://mongodb:27017/ecommerce
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-production-secret-key-change-this
      - NODE_ENV=production      # Production mode
    networks:
      - ecommerce-network

  mongodb:
    image: mongo:5.0
    restart: unless-stopped      # Auto-restart
    volumes:
      - mongo-data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d  # Init scripts
    networks:
      - ecommerce-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes  # Enable persistence
    volumes:
      - redis-data:/data         # Persistent Redis data
    networks:
      - ecommerce-network

  nginx:
    build: ./nginx
    ports:
      - "80:80"                  # Only expose port 80
    restart: unless-stopped
    depends_on:
      - frontend
      - backend
    networks:
      - ecommerce-network

volumes:
  mongo-data:                    # MongoDB persistent storage
  redis-data:                    # Redis persistent storage

networks:
  ecommerce-network:
    driver: bridge
```

**Production vs Development Differences:**
- **restart: unless-stopped**: Auto-restart containers
- **NODE_ENV=production**: Production optimizations
- **Redis persistence**: `--appendonly yes`
- **No port exposure**: Only Nginx port 80 exposed
- **Your IP configured**: `13.233.143.170`

---

## ☁️ AWS EC2 Deployment Guide

### Step 1: AWS EC2 Instance Setup

#### 1.1 Launch EC2 Instance
```bash
# AWS Console Steps:
1. Login to AWS Console → EC2 Dashboard
2. Click "Launch Instance"
3. Choose "Amazon Linux 2 AMI (HVM)"
4. Select "t2.micro" (Free tier)
5. Configure Security Group:
   - SSH (22): Your IP only
   - HTTP (80): 0.0.0.0/0 (Anywhere)
   - HTTPS (443): 0.0.0.0/0 (Anywhere)
6. Select/Create Key Pair
7. Launch Instance
```

#### 1.2 Security Group Configuration
```
Type        Protocol    Port Range    Source
────────────────────────────────────────────
SSH         TCP         22           Your IP/32
HTTP        TCP         80           0.0.0.0/0
HTTPS       TCP         443          0.0.0.0/0
```

**Why these ports?**
- **Port 22**: SSH access for server management
- **Port 80**: HTTP traffic for web application
- **Port 443**: HTTPS traffic (future SSL setup)

### Step 2: Connect to EC2
```bash
# From your local machine:
ssh -i your-key.pem ec2-user@13.233.143.170

# If permission error:
chmod 400 your-key.pem
ssh -i your-key.pem ec2-user@13.233.143.170
```

### Step 3: Install Docker & Docker Compose

#### 3.1 Update System
```bash
sudo yum update -y
# Updates all installed packages to latest versions
# -y flag: Automatically answer "yes" to prompts
```

#### 3.2 Install Docker
```bash
sudo yum install -y docker
# Installs Docker engine from Amazon Linux repository

sudo systemctl start docker
# Starts Docker daemon service

sudo systemctl enable docker
# Enables Docker to start automatically on boot

sudo usermod -a -G docker ec2-user
# Adds ec2-user to docker group (run docker without sudo)
# -a: append to group
# -G: specify group
```

#### 3.3 Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# Downloads latest Docker Compose binary
# $(uname -s): Operating system (Linux)
# $(uname -m): Architecture (x86_64)

sudo chmod +x /usr/local/bin/docker-compose
# Makes Docker Compose executable
# +x: Add execute permission
```

#### 3.4 Verify Installation
```bash
docker --version
# Should show: Docker version 20.x.x

docker-compose --version
# Should show: docker-compose version 1.x.x

# IMPORTANT: Logout and login again for group changes
exit
ssh -i your-key.pem ec2-user@13.233.143.170
```

### Step 4: Upload Project Files
```bash
# From your local machine (in project directory):
scp -i your-key.pem -r . ec2-user@13.233.143.170:/home/ec2-user/ecommerce-app/

# Command breakdown:
# scp: Secure copy over SSH
# -i: Identity file (private key)
# -r: Recursive (copy directories)
# .: Current directory (all files)
# Destination: /home/ec2-user/ecommerce-app/
```

### Step 5: Deploy Application
```bash
# SSH to EC2:
ssh -i your-key.pem ec2-user@13.233.143.170

# Navigate to project:
cd /home/ec2-user/ecommerce-app

# Verify files uploaded:
ls -la
# Should show all project files

# Start production deployment:
docker-compose -f docker-compose.prod.yml up -d

# Command breakdown:
# docker-compose: Docker Compose command
# -f: Specify compose file
# docker-compose.prod.yml: Production configuration
# up: Start services
# -d: Detached mode (run in background)
```

---

## 🔧 Commands Explanation

### Docker Commands
```bash
# Build images
docker-compose build
# Builds Docker images from Dockerfiles
# Creates images tagged with service names

# Start services
docker-compose up -d
# Starts all services defined in docker-compose.yml
# -d: Detached mode (background)

# Stop services
docker-compose down
# Stops and removes containers
# Networks are also removed
# Volumes are preserved

# View logs
docker-compose logs -f
# Shows logs from all services
# -f: Follow (real-time logs)

# View specific service logs
docker-compose logs backend
# Shows logs only from backend service

# Check service status
docker-compose ps
# Shows status of all services
# Similar to 'ps' command for processes

# Restart services
docker-compose restart
# Restarts all services without rebuilding

# Scale services
docker-compose up -d --scale backend=3
# Runs 3 instances of backend service
# Load balancing handled by Docker

# Remove everything
docker-compose down -v
# Stops containers and removes volumes
# ⚠️ This deletes all data!
```

### System Monitoring Commands
```bash
# Container resource usage
docker stats
# Shows real-time CPU, memory, network usage
# Similar to 'top' command

# System resource usage
free -h          # Memory usage
df -h            # Disk usage
top              # CPU usage
htop             # Better version of top (if installed)

# Network connections
sudo netstat -tulpn | grep :80
# Shows what's using port 80
# t: TCP, u: UDP, l: listening, p: process, n: numeric
```

### Application Testing Commands
```bash
# Health check
curl http://13.233.143.170/health
# Tests if backend API is responding
# Should return: {"status":"OK","service":"Backend API"}

# Get products
curl http://13.233.143.170/api/products
# Retrieves all products from database
# Should return JSON array

# Add new product
curl -X POST http://13.233.143.170/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 999,
    "category": "Electronics",
    "stock": 10,
    "description": "Test product description"
  }'
# Adds new product to database
# -X POST: HTTP POST method
# -H: Header
# -d: Data payload
```

---

## 🧪 Testing & Verification

### 1. Container Health Check
```bash
# Check if all containers are running
docker-compose -f docker-compose.prod.yml ps

# Expected output:
#        Name                      Command               State           Ports
# ────────────────────────────────────────────────────────────────────────────
# project1_backend_1    npm start                    Up      5000/tcp
# project1_frontend_1   npm start                    Up      3000/tcp
# project1_mongodb_1    docker-entrypoint.sh mongod  Up      27017/tcp
# project1_nginx_1      /docker-entrypoint.sh ngin…  Up      0.0.0.0:80->80/tcp
# project1_redis_1      docker-entrypoint.sh redis…  Up      6379/tcp
```

### 2. Application Testing
```bash
# Test main application
curl -I http://13.233.143.170
# Should return HTTP 200 OK

# Test API health
curl http://13.233.143.170/health
# Expected: {"status":"OK","service":"Backend API"}

# Test database connection
curl http://13.233.143.170/api/products
# Should return array of products
```

### 3. Browser Testing
```
1. Open browser
2. Go to: http://13.233.143.170
3. You should see:
   - E-commerce Dashboard
   - Form to add products
   - List of existing products (3 sample products)
4. Try adding a new product
5. Verify it appears in the list
```

### Application in Action
![Application Running](img/Screenshot%202026-01-18%20181407.png)
*Application Successfully Running on AWS EC2*

![Container Status](img/Screenshot%202026-01-18%20181514.png)
*All 5 Containers Running Successfully*

### 4. Performance Testing
```bash
# Check resource usage
docker stats

# Expected resource usage:
# - Frontend: ~50-100MB RAM
# - Backend: ~30-50MB RAM
# - MongoDB: ~100-200MB RAM
# - Redis: ~10-20MB RAM
# - Nginx: ~5-10MB RAM
```

---

## 🚨 Troubleshooting

### Common Issue 1: Cannot Access Application
```bash
# Check if containers are running
docker-compose ps

# If containers are not running:
docker-compose -f docker-compose.prod.yml up -d

# Check security group:
# AWS Console → EC2 → Security Groups
# Ensure port 80 is open to 0.0.0.0/0

# Check if port 80 is in use:
sudo netstat -tulpn | grep :80
```

### Common Issue 2: Container Keeps Restarting
```bash
# Check logs for errors
docker-compose logs backend

# Common causes:
# 1. Database connection failed
# 2. Port already in use
# 3. Missing environment variables
# 4. Code syntax errors

# Solution: Fix the error and restart
docker-compose restart backend
```

### Common Issue 3: Database Connection Error
```bash
# Check MongoDB container
docker-compose logs mongodb

# Check if MongoDB is accessible
docker exec -it <mongodb-container-id> mongo
# Inside MongoDB shell:
show dbs
use ecommerce
db.products.find()

# If database is empty, restart with init script:
docker-compose down
docker-compose -f docker-compose.prod.yml up -d
```

### Common Issue 4: Out of Disk Space
```bash
# Check disk usage
df -h

# Clean up Docker resources
docker system prune -a
# This removes:
# - Stopped containers
# - Unused networks
# - Unused images
# - Build cache

# Remove specific containers
docker rm $(docker ps -aq)

# Remove specific images
docker rmi $(docker images -q)
```

### Emergency Commands
```bash
# Stop everything
docker-compose down

# Force remove containers
docker rm -f $(docker ps -aq)

# Restart Docker service
sudo systemctl restart docker

# Reboot EC2 instance
sudo reboot
```

---

## 🎯 Success Indicators

### ✅ Deployment Successful When:
1. All 5 containers show "Up" status
2. Application accessible at http://13.233.143.170
3. Health check returns {"status":"OK"}
4. Can add and view products
5. No error logs in containers
6. Resource usage under 80%

### ✅ Performance Benchmarks:
- Page load time: < 3 seconds
- API response time: < 500ms
- Memory usage: < 500MB total
- CPU usage: < 50%

---

## 📞 Quick Reference

### Essential Commands
```bash
# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Test
curl http://13.233.143.170/health
```

### Important URLs
- **Application**: http://13.233.143.170
- **Health Check**: http://13.233.143.170/health
- **API Products**: http://13.233.143.170/api/products

### Support Files Created
- ✅ IP configured in docker-compose.prod.yml
- ✅ Deployment commands ready
- ✅ All services configured
- ✅ Sample data included

## 🖼️ Project Gallery

### Application Interface
| Dashboard | Product Management |
|-----------|--------------------|
| ![Dashboard](img/Screenshot%202026-01-18%20181346.png) | ![Products](img/Screenshot%202026-01-18%20181358.png) |

### Deployment Success
| Application Running | Container Status |
|--------------------|-----------------|
| ![Running App](img/Screenshot%202026-01-18%20181407.png) | ![Containers](img/Screenshot%202026-01-18%20181514.png) |

**🎉 My application is ready for deployment!**