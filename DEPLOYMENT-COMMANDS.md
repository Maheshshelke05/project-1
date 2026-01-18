# 🚀 Deployment Commands for Your Server (13.233.143.170)

## 📋 Ready-to-Use Commands

### 1. Upload Project to EC2
```bash
# From your local machine (run in project directory):
scp -i your-key.pem -r . ec2-user@13.233.143.170:/home/ec2-user/ecommerce-app/
```

### 2. Connect to EC2
```bash
ssh -i your-key.pem ec2-user@13.233.143.170
```

### 3. Setup Docker on EC2
```bash
# Run these commands on EC2:
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
ssh -i your-key.pem ec2-user@13.233.143.170
```

### 4. Deploy Application
```bash
# On EC2 server:
cd /home/ec2-user/ecommerce-app
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Verify Deployment
```bash
# Check containers
docker-compose -f docker-compose.prod.yml ps

# Test health
curl http://localhost/health

# Test from outside
curl http://13.233.143.170/health
```

## 🌐 Access URLs

- **Main Application**: http://13.233.143.170
- **Health Check**: http://13.233.143.170/health
- **API Products**: http://13.233.143.170/api/products

## 🔧 Monitoring Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check resource usage
docker stats

# Restart if needed
docker-compose -f docker-compose.prod.yml restart
```

## ⚠️ Important Notes

1. **Security Group**: Ensure ports 22, 80, 443 are open
2. **Key File**: Replace "your-key.pem" with your actual key file name
3. **File Path**: Make sure key file path is correct

## 🎯 Quick Test Commands

```bash
# Test API endpoints:
curl http://13.233.143.170/health
curl http://13.233.143.170/api/products

# Add new product:
curl -X POST http://13.233.143.170/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":999,"category":"Test","stock":5,"description":"Test item"}'
```

## 🚨 If Something Goes Wrong

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Rebuild if needed
docker-compose -f docker-compose.prod.yml up --build -d
```