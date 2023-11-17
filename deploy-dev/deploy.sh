#!/bin/bash

cd /home/ec2-user

if [ ! -d "/home/ec2-user/server-config" ]; then
  git clone git@github.com:42cabi/config.git server-config
fi

cd server-config
git pull origin main

mkdir -p /home/ec2-user/deploy/zip
cd /home/ec2-user/deploy/zip/

cd pinpoint-application

docker compose down --rmi all
docker compose up -d
