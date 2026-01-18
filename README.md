# 🛒 E-commerce Microservices with Docker

Real-world production-ready e-commerce application with microservices architecture.

## 🏗️ Architecture

- **Frontend**: React.js (Port 3000)
- **Backend**: Node.js/Express API (Port 5000)
- **Database**: MongoDB (Port 27017)
- **Cache**: Redis (Port 6379)
- **Proxy**: Nginx (Port 80)

## 🚀 Local Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access: http://localhost

## ☁️ AWS EC2 Deployment

### 1. EC2 Setup
```bash
# Launch Amazon Linux 2 EC2 instance
# Security Group: Allow ports 22, 80, 443

# Connect to EC2
ssh -i your-key.pem ec2-user@YOUR-EC2-IP

# Run deployment script
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

### 2. Upload Project
```bash
# From local machine
scp -i your-key.pem -r . ec2-user@YOUR-EC2-IP:/home/ec2-user/ecommerce-app/
```

### 3. Deploy
```bash
# On EC2 instance
cd /home/ec2-user/ecommerce-app

# Update docker-compose.prod.yml with your EC2 public IP
sed -i 's/YOUR-EC2-PUBLIC-IP/YOUR-ACTUAL-IP/g' docker-compose.prod.yml

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

## 📊 Monitoring

```bash
# Check service health
curl http://YOUR-EC2-IP/health

# View container logs
docker-compose logs backend
docker-compose logs frontend

# Monitor resources
docker stats
```

## 🔧 Troubleshooting

```bash
# Restart services
docker-compose restart

# Rebuild containers
docker-compose up --build -d

# Clean up
docker system prune -a
```

## 🌟 Features

- ✅ Microservices architecture
- ✅ Docker containerization
- ✅ Redis caching
- ✅ MongoDB persistence
- ✅ Nginx load balancing
- ✅ Production-ready
- ✅ AWS EC2 deployment
- ✅ Health checks
- ✅ Auto-restart policies

## 📝 API Endpoints

- `GET /health` - Health check
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product

## 🔐 Security Notes

- Change JWT_SECRET in production
- Use environment variables
- Enable MongoDB authentication
- Configure SSL/TLS
- Set up proper firewall rules