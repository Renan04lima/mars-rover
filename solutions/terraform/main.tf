provider "aws" {
  region = var.aws_region
}

############################
# VARIABLES
############################

variable "aws_region" {
  default = "us-east-1"
}

variable "vpc_cidr" {
  default = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  default = "10.0.1.0/24"
}

variable "key_name" {
  default = "mars-rover-key"
}

############################
# KEY PAIR
############################

resource "aws_key_pair" "deployer" {
  key_name   = var.key_name
  public_key = file("~/.ssh/id_rsa.pub")
}

############################
# VPC
############################

resource "aws_vpc" "mars_vpc" {
  cidr_block = var.vpc_cidr

  tags = {
    Name = "mars-rover-vpc"
  }
}

############################
# SUBNET
############################

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.mars_vpc.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "mars-rover-public-subnet"
  }
}

############################
# INTERNET GATEWAY
############################

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.mars_vpc.id

  tags = {
    Name = "mars-rover-igw"
  }
}

############################
# ROUTE TABLE
############################

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.mars_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "mars-rover-public-rt"
  }
}

resource "aws_route_table_association" "rt_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

############################
# SECURITY GROUP
############################

resource "aws_security_group" "mars_sg" {
  name   = "mars-rover-sg"
  vpc_id = aws_vpc.mars_vpc.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"

    # ideal seria colocar seu IP
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "FastAPI"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "React"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "mars-rover-sg"
  }
}

############################
# EC2
############################

resource "aws_instance" "mars_server" {
  ami = "ami-0b6c6ebed2801a5cb" # Canonical, Ubuntu, 24.04, amd64 noble image
  instance_type = "t3.micro"

  subnet_id              = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.mars_sg.id]

  key_name = aws_key_pair.deployer.key_name

  user_data = file("${path.module}/setup.sh")

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "Mars-Rover-Server"
  }
}

############################
# OUTPUTS
############################

output "public_ip" {
  value = aws_instance.mars_server.public_ip
}

output "ssh_command" {
  value = "ssh ubuntu@${aws_instance.mars_server.public_ip}"
}

output "frontend_url" {
  value = "http://${aws_instance.mars_server.public_ip}:3000"
}

output "backend_docs" {
  value = "http://${aws_instance.mars_server.public_ip}:8000/docs"
}