#!/bin/bash

set -eux

echo "Updating system"

apt-get update -y
apt-get upgrade -y

apt-get install -y git curl ca-certificates nginx openssl

# -------------------------
# Install Docker
# -------------------------

install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc

chmod a+r /etc/apt/keyrings/docker.asc

echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo $VERSION_CODENAME) stable" \
> /etc/apt/sources.list.d/docker.list

apt-get update -y

apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

systemctl enable docker
systemctl start docker

usermod -aG docker ubuntu

# -------------------------
# Clone project
# -------------------------

cd /home/ubuntu

git clone https://github.com/Renan04lima/mars-rover.git

cd mars-rover/solutions/api

docker compose up -d --build

# -------------------------
# Generate self-signed SSL
# -------------------------

mkdir -p /etc/nginx/ssl

openssl req -x509 -nodes -days 365 \
-newkey rsa:2048 \
-keyout /etc/nginx/ssl/mars.key \
-out /etc/nginx/ssl/mars.crt \
-subj "/CN=$(curl -s http://169.254.169.254/latest/meta-data/public-hostname)"

# -------------------------
# Configure Nginx
# -------------------------

cat > /etc/nginx/sites-available/mars << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl;
    server_name _;

    ssl_certificate /etc/nginx/ssl/mars.crt;
    ssl_certificate_key /etc/nginx/ssl/mars.key;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

ln -s /etc/nginx/sites-available/mars /etc/nginx/sites-enabled/mars

rm /etc/nginx/sites-enabled/default || true

systemctl restart nginx