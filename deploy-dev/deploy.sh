#!/bin/bash

mkdir -p /home/ec2-user/deploy/zip
cd /home/ec2-user/deploy/zip/

docker stop cabi_dev
docker rm cabi_dev
docker rmi cabi_dev

docker build -t cabi_dev ./          # Docker Image 생성
mkdir -p /home/ec2-user/logs
docker run --name cabi_dev -d -p 4242:4242 -v /home/ec2-user/logs:/logs cabi_dev  # Docker Container 생성
