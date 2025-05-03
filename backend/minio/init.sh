#!/bin/sh

GREEN='\033[0;32m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "Wating for MinIO server to be ready..."

MAX_WAIT=30
CURRENT_WAIT=0

# Health checking
while [ $CURRENT_WAIT -lt $MAX_WAIT ]; do
  # Try to access MinIO server with mc(MinIO Client)
  mc alias set healthcheck $MINIO_LOCAL_SERVER dummy_key dummy_secret --api S3v4 > /dev/null 2>&1
  mc ping healthcheck --count 1 > /dev/null 2>&1

  # Succeed
  if [ $? -eq 0 ]; then
    echo -e "${GREEN} MinIO server is ready! ${RESET}"
    mc alias remove healthcheck > /dev/null 2>&1
    break
  fi

  # Failed to ping, wait and try again
  mc alias remove healthcheck > /dev/null 2>&1
  echo -e "Still waiting for MinIO server... (${CURRENT_WAIT}s/${MAX_WAIT}s)"
  sleep 2
  CURRENT_WAIT=$((CURRENT_WAIT + 2))
done

# If failed
if [ $CURRENT_WAIT -ge $MAX_WAIT ]; then
  # Error and exit
  echo -e "${RED} MinIO server is not become ready within ${MAX_WAIT}s. Exiting. ${RESET}"
  exit 1
fi


# Set up MinIO
echo -e "Configuring MinIO client(mc)..."
mc alias set local $MINIO_LOCAL_SERVER $MINIO_S3_ACCESS_KEY $MINIO_S3_SECRET_KEY --api S3v4

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

# Finish and start MinIO
echo -e "${GREEN} MinIO initialization completed successfully. ${RESET}"
exec "$@"