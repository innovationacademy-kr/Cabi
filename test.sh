#!/bin/bash

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

# Execute git fsck command and capture the output
unreachable_commits=$(git fsck --full --no-reflogs --unreachable --lost-found)

# Loop through each line of the output
echo "$unreachable_commits" | while read -r line; do
  # Extract the commit hash from the line
  if [[ $line =~ unreachable[[:space:]]commit[[:space:]]([0-9a-f]{40}) ]]; then
    commit_hash="${BASH_REMATCH[1]}"

    # Check the type of the object
    object_type=$(git cat-file -t "$commit_hash")
    if [[ $object_type != "commit" ]]; then
      continue
    fi
    commit_content=$(git cat-file -p "$commit_hash")

    # Extract the date line from the commit data
    commit_date=$(echo "$commit_content" | grep "^author" | sed 's/^author .* <.*> \([0-9]*\) .*/\1/')

    # Convert the date to a more readable format using Perl
    formatted_date=$(perl -e "use POSIX qw(strftime); print strftime('%Y-%m-%d %H:%M:%S', localtime($commit_date));")

    # Print the entire commit data with formatted date
    # 우리가 복구하고자 하는 브랜치의 마지막 커밋은 46:01에 발생했다.
    # if echo "$commit_content" | sed "s/$commit_date/$formatted_date/" | grep "46:01" -q; then
    echo "commit_hash: $commit_hash"
    echo "$commit_content" | sed "s/$commit_date/$formatted_date/"
    # fi
  fi
done



