#!/bin/bash

# # author jiwon <jwpark0119@gmail.com> 1706528251 +0900
# # 뒤에서 0, 1, 2, 3. 3번째 필드를 기준으로 내림차순 정렬
# bash test.sh | grep +0900 | sort -k3,3nr


# # Define the Unix timestamp
# unix_timestamp=1707734761

# # Convert the Unix timestamp to human-readable date and time using Python
# human_readable_date=$(python3 -c "
# import time
# from datetime import datetime
# timestamp = 1707734761
# date_time = datetime.utcfromtimestamp(timestamp).strftime('%Y.%m.%d %H:%M:%S')
# print(date_time)
# ")

to_human_readable_date() {
  # Convert the Unix timestamp to human-readable date and time using Python
  human_readable_date=$(python3 -c "
import time
from datetime import datetime
timestamp = $1
date_time = datetime.utcfromtimestamp(timestamp).strftime('%Y.%m.%d %H:%M:%S')
print(date_time)
")
  echo $human_readable_date
}

to_human_readable_date 1707714998


# # Process the input
# bash test.sh | grep +0900 | sort -k3,3nr | while read line; do
#   # Extract the third field (timestamp)
#   timestamp=$(echo $line | awk '{print $4}')

#   # Convert the timestamp to human-readable date
#   human_readable_date=$(to_human_readable_date $timestamp)

#   # Replace the timestamp with the human-readable date in the line
#   new_line=$(echo $line | sed "s/$timestamp/$human_readable_date/")

#   # Print the modified line
#   echo $new_line
# done
