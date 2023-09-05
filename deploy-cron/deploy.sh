#!/bin/bash

mkdir -p /home/ec2-user/cron/zip
cd /home/ec2-user/cron/zip/

docker compose down --rmi all
docker compose up -d
