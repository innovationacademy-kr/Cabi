#!/bin/bash

mkdir -p /home/ec2-user/deploy/zip/
cd /home/ec2-user/deploy/zip/

docker stop cabi_main
docker rm cabi_main
docker rmi cabi_main

docker build -t cabi_main ./          # Docker Image 생성
mkdir -p /home/ec2-user/logs
docker run --name cabi_main -d -p 4242:4242 -v /home/ec2-user/logs:/logs cabi_main  # Docker Container 생성

