#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[0;37m'
RESET='\033[0m'

echo -e $GREEN"이 스크립트는 까비 프로젝트 홈 디렉토리에서 실행되어야 합니다."
echo -e $RESET"1초 뒤 실행됩니다."
sleep 1

arg=$1

echo -en $CYAN
if [ "$arg" == "docker" ] || [ "$arg" == "all" ]; then
    echo "Local DB Compose Down"
    docker compose -f ./backend/docker-compose.yaml down

    echo "Local DB Compose Up with daemon"
    docker compose -f ./backend/docker-compose.yaml up --build -d
fi

echo -en $CYAN
if [ "$arg" == "build" ] || [ "$arg" == "re" ] || [ "$arg" == "all" ]; then
    echo "Build with Gradle"
    cd backend/
    ./gradlew build -x test
    cd ..
fi

echo -en $CYAN
if [ "$arg" == "run" ] || [ "$arg" == "re" ] || [ "$arg" == "all" ]; then
    echo "Spring Boot Run"
    java -jar -Dspring.profiles.active=local ./backend/build/libs/cabinet-0.0.1-SNAPSHOT.jar
fi

echo -en $RESET