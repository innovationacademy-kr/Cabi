#!/bin/bash

mkdir -p /home/ec2-user/deploy/zip/
echo "> 현재 실행 중인 Docker 컨테이너 pid 확인" >> /home/ec2-user/deploy/deploy.log
CURRENT_PID=$(docker container ls -q)

if [ -z $CURRENT_PID ]
then
  echo "> 현재 구동중인 Docker 컨테이너가 없으므로 종료하지 않습니다." >> /home/ec2-user/deploy/deploy.log
else
  echo "> docker stop $CURRENT_PID" # 현재 구동중인 Docker 컨테이너가 있다면 모두 중지
  docker stop $CURRENT_PID
  sleep 5
fi

cd /home/ec2-user/deploy/zip/
docker stop cabi_main
docker rm cabi_main
docker build -t cabi_main ./          # Docker Image 생성
docker run --name cabi_main -d -p 4242:4242 -v /home/ec2-user/logs:/logs cabi_main  # Docker Container 생성

