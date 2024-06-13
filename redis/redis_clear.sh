#! /bin/bash

arg=$1

redis=$(docker ps | grep redis | cut -d ' ' -f1)

echo "$arg:coinCount"

docker exec ${redis} redis-cli del "$arg:coinCount"
docker exec ${redis} redis-cli del "$arg:coinCollect"
docker exec ${redis} redis-cli del "$arg:coinCollectCount"
