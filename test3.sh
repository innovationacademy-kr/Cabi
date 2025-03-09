
#!/bin/bash

commit_hash="0938f112b0ec344ddeacd10f81c79c6c4e756fab"

# Extract commit data using git cat-file -p
commit_data=$(git cat-file -p "$commit_hash")

# Extract the date line from the commit data
commit_date=$(echo "$commit_data" | grep "^author" | sed 's/^author .* <.*> \([0-9]*\) .*/\1/')

# Convert the date to a more readable format
formatted_date=$(date -d @$commit_date "+%Y-%m-%d %H:%M:%S")

# Print the entire commit data with formatted date
echo "$commit_data" | sed "s/$commit_date/$formatted_date/"
