#!/bin/bash

set -eux

echo "Updating system"

apt-get update -y
apt-get upgrade -y

apt-get install -y git curl ca-certificates

# Add Docker GPG key
install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc

chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository
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

cd /home/ubuntu

echo "Cloning repository"

git clone https://github.com/Renan04lima/mars-rover.git

cd mars-rover/solutions/api

echo "Starting containers"

docker compose up -d --build