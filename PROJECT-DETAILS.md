# 🛒 E-commerce Microservices Docker Project

## 📋 Project Overview

**Project Name:** E-commerce Microservices Application  
**Technology Stack:** Docker, React.js, Node.js, MongoDB, Redis, Nginx  
**Deployment:** AWS EC2 Amazon Linux  
**Architecture:** Microservices with containerization  

## 🏗️ Project Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │  React Frontend │    │  Node.js API    │
│   Port: 80      │────│   Port: 3000    │────│   Port: 5000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Redis Cache   │    │   MongoDB DB    │
                       │   Port: 6379    │    │   Port: 27017   │
                       └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
ecommerce-microservices/
├── 📄 docker-compose.yml          # Development configuration
├── 📄 docker-compose.prod.yml     # Production configuration
├── 📄 deploy-ec2.sh              # EC2 deployment script
├── 📄 README.md                  # Project documentation
├── 📄 Makefile                   # Helper commands
├── 📄 .env                       # Environment variables
│
├── 📁 frontend/                  # React.js Application
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📁 public/
│   │   └── 📄 index.html
│   └── 📁 src/
│       ├── 📄 App.js
│       └── 📄 index.js
│
├── 📁 backend/                   # Node.js API
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   └── 📄 server.js
│
├── 📁 nginx/                     # Reverse Proxy
│   ├── 📄 Dockerfile
│   └── 📄 nginx.conf
│
└── 📁 mongo-init/               # Database Initialization
    └── 📄 init.js
```

## 🔧 Services Details

### 1. **Frontend Service (React.js)**
- **Port:** 3000
- **Features:** Product dashboard, Add/View products
- **Dependencies:** Backend API
- **Container:** Node.js 18 Alpine

### 2. **Backend Service (Node.js/Express)**
- **Port:** 5000
- **Features:** REST API, MongoDB integration, Redis caching
- **Endpoints:**
  - `GET /health` - Health check
  - `GET /api/products` - Get all products
  - `POST /api/products` - Add new product
- **Dependencies:** MongoDB, Redis

### 3. **Database Service (MongoDB)**
- **Port:** 27017
- **Features:** Product data storage
- **Volume:** Persistent data storage
- **Initialization:** Sample products loaded

### 4. **Cache Service (Redis)**
- **Port:** 6379
- **Features:** API response caching
- **Cache Duration:** 5 minutes for products

### 5. **Proxy Service (Nginx)**
- **Port:** 80
- **Features:** Load balancing, Reverse proxy
- **Routes:**
  - `/` → Frontend (React)
  - `/api/` → Backend (Node.js)
  - `/health` → Backend health check

## 🚀 Local Development Setup

### Prerequisites
- Docker installed
- Docker Compose installed
- Git (optional)

### Step 1: Clone/Download Project
```bash
# If using Git
git clone <repository-url>
cd ecommerce-microservices

# Or download and extract ZIP file
```

### Step 2: Start Development Environment
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Step 3: Access Application
- **Main App:** http://localhost
- **API Health:** http://localhost/health
- **Direct Frontend:** http://localhost:3000
- **Direct Backend:** http://localhost:5000

### Step 4: Stop Services
```bash
docker-compose down
```

## ☁️ AWS EC2 Production Deployment

### Prerequisites
- AWS Account
- EC2 Key Pair (.pem file)
- Basic AWS knowledge

### Step 1: Launch EC2 Instance

1. **Go to AWS Console → EC2**
2. **Launch Instance:**
   - **AMI:** Amazon Linux 2
   - **Instance Type:** t2.micro (Free tier)
   - **Key Pair:** Select your .pem file
   - **Security Group:** Create new with rules:
     ```
     SSH (22)    - Your IP
     HTTP (80)   - 0.0.0.0/0
     HTTPS (443) - 0.0.0.0/0
     ```
3. **Launch Instance**
4. **Note down Public IP**

### Step 2: Connect to EC2
```bash
# From your local machine
ssh -i your-key.pem ec2-user@YOUR-EC2-PUBLIC-IP
```

### Step 3: Setup Docker on EC2
```bash
# Run deployment script
chmod +x deploy-ec2.sh
./deploy-ec2.sh

# Or manual setup:
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again
exit
```

### Step 4: Upload Project Files
```bash
# From your local machine
scp -i your-key.pem -r . ec2-user@YOUR-EC2-PUBLIC-IP:/home/ec2-user/ecommerce-app/
```

### Step 5: Configure Production Environment
```bash
# SSH back to EC2
ssh -i your-key.pem ec2-user@YOUR-EC2-PUBLIC-IP

# Go to project directory
cd /home/ec2-user/ecommerce-app

# Update production config with your EC2 IP
sed -i 's/YOUR-EC2-PUBLIC-IP/YOUR-ACTUAL-EC2-IP/g' docker-compose.prod.yml
```

### Step 6: Deploy Production
```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Step 7: Verify Deployment
```bash
# Check health
curl http://YOUR-EC2-PUBLIC-IP/health

# Check if all containers are running
docker ps

# Monitor resources
docker stats
```

## 🔍 Testing & Verification

### Local Testing
```bash
# Health check
curl http://localhost/health

# Get products
curl http://localhost/api/products

# Add product
curl -X POST http://localhost/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":999,"category":"Test","stock":5,"description":"Test description"}'
```

### Production Testing
```bash
# Replace YOUR-EC2-IP with actual IP
curl http://YOUR-EC2-IP/health
curl http://YOUR-EC2-IP/api/products
```

## 📊 Monitoring & Maintenance

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs backend
docker-compose logs frontend
```

### Monitor Resources
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Container status
docker-compose ps
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Update Application
```bash
# Rebuild and restart
docker-compose up --build -d

# Or for production
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using port
   sudo netstat -tulpn | grep :80
   
   # Kill process
   sudo kill -9 <PID>
   ```

2. **Container Won't Start**
   ```bash
   # Check logs
   docker-compose logs <service-name>
   
   # Rebuild container
   docker-compose up --build <service-name>
   ```

3. **Database Connection Issues**
   ```bash
   # Check MongoDB container
   docker-compose logs mongodb
   
   # Restart database
   docker-compose restart mongodb
   ```

4. **EC2 Access Issues**
   ```bash
   # Check security group
   # Ensure port 80 is open to 0.0.0.0/0
   
   # Check if Docker is running
   sudo systemctl status docker
   ```

### Cleanup Commands
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (⚠️ This deletes data)
docker-compose down -v

# Clean up system
docker system prune -a
```

## 🔐 Security Best Practices

### Production Security
1. **Change default secrets:**
   ```bash
   # Update JWT_SECRET in docker-compose.prod.yml
   JWT_SECRET=your-strong-secret-key-here
   ```

2. **Enable MongoDB authentication**
3. **Setup SSL/TLS certificates**
4. **Configure firewall rules**
5. **Regular security updates**

### Environment Variables
```bash
# Create .env file for sensitive data
MONGO_URI=mongodb://mongodb:27017/ecommerce
REDIS_URL=redis://redis:6379
JWT_SECRET=your-secret-key
```

## 📈 Scaling & Performance

### Horizontal Scaling
```yaml
# In docker-compose.yml
backend:
  scale: 3  # Run 3 backend instances
```

### Performance Monitoring
```bash
# Monitor container performance
docker stats

# Check application metrics
curl http://localhost/health
```

## 🎯 Next Steps

1. **Add SSL/HTTPS**
2. **Implement user authentication**
3. **Add more API endpoints**
4. **Setup CI/CD pipeline**
5. **Add monitoring (Prometheus/Grafana)**
6. **Implement logging (ELK stack)**

## 📞 Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Verify all containers are running: `docker-compose ps`
3. Check network connectivity
4. Review security group settings (for EC2)

---

**Project Status:** ✅ Production Ready  
**Last Updated:** $(date)  
**Version:** 1.0.0