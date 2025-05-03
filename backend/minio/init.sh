#!/bin/sh
# minio init script

GREEN='\033[0;32m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "Wating for MinIO server to be ready..."

MAX_WAIT=30
CURRENT_WAIT=0
TIME_WAIT=2

# Health checking
while [ $CURRENT_WAIT -lt $MAX_WAIT ]; do
  # Try to check endpoints with curl
  curl -sf $MINIO_API_ADDRESS/minio/health/live > /dev/null 2>&1

  # Succeed
  if [ $? -eq 0 ]; then
    echo -e "${GREEN} MinIO server is ready! ${RESET}"
    break
  fi

  # If failed
#  echo -e "Still waiting for MinIO server... (${CURRENT_WAIT}s/${MAX_WAIT}s)"
  printf "\r\033[KStill waiting for MinIO server... (${CURRENT_WAIT}s/${MAX_WAIT}s)"
  sleep $TIME_WAIT
  CURRENT_WAIT=$((CURRENT_WAIT + TIME_WAIT))
done

# If failed
if [ $CURRENT_WAIT -ge $MAX_WAIT ]; then
  # Error and exit
  echo -e "${RED} MinIO server is not become ready within ${MAX_WAIT}s. Exiting. ${RESET}"
  exit 1    # passed to entrypoint-wrapper.sh
fi


# Set up MinIO with user and password (same as access and secret key in MinIO, only for local)
echo -e "Configuring MinIO client(mc)..."
mc alias set local $MINIO_API_ADDRESS $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD --api S3v4

# If failed
if [ $? -ne 0 ]; then
  echo -e "${RED} Failed to configure MinIO alias! Check connection of credentials. ${RESET}"
  exit 1
fi

# Succeed
echo -e "${GREEN} MinIO client configured successfully. ${RESET}"


# Create bucket
echo -e "Creating bucket..."
mc mb --ignore-exiting "local/$MINIO_S3_BUCKET"

if [ $? -eq 0 ]; then
  echo -e "${GREEN} Bucket $MINIO_S3_BUCKET created successfully(or already exists). ${RESET}"
else
  echo -e "${RED} Failed to create bucket $MINIO_S3_BUCKET ${RESET}"
  mc ls local
  exit 1
fi

# Finish script and start MinIO
echo -e "${GREEN} MinIO initialization completed successfully. ${RESET}"
exit 0