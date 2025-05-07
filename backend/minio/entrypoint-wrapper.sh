#!/bin/sh
# entrypoint-wrapper script

# Run MinIO server in the background using parameters passed in command
echo "Starting MinIO server in background..."
minio "$@" &

# Save MinIO server process ID
MINIO_PID=$!

# Execute initialization script
echo "Executing initialization script (/app/scripts/init.sh)..."
/app/scripts/init.sh

# Save exit status of the initialization script
INIT_EXIT_CODE=$?
if [ $INIT_EXIT_CODE -ne 0 ]; then
  # If failed, exit MinIO
  echo "Initialization script failed with exit code $INIT_EXIT_CODE. Stopping container."
  kill $MINIO_PID
  exit $INIT_EXIT_CODE
fi

# Wait for MinIO server to be exited (different from DB container, because of creating bucket)
echo "Initialization complete. Waiting for MinIO server process (PID: $MINIO_PID) to exit..."
wait $MINIO_PID

# Save exit status of the MinIO server
EXIT_CODE=$?
echo "MinIO server process exited with code $EXIT_CODE."
exit $EXIT_CODE
