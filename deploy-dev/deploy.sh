#!/bin/bash

mkdir -p /home/ec2-user/deploy/zip
cd /home/ec2-user/deploy/zip/

cd pinpoint-application

docker compose down --rmi all
docker compose up -d
