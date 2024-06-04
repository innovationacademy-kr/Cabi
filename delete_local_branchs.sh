#!/bin/bash

# 기본 브랜치 이름 (필요에 따라 변경)
default_branch="main"

# 원격 브랜치 목록 가져오기
remote_branches=$(git branch -r | sed 's/ *origin\///')

# 로컬 브랜치 목록 가져오기 (기본 브랜치 제외)
local_branches=$(git branch | grep -v " $default_branch$" | grep -v "\*")

# 로컬 브랜치 중 원격에 없는 브랜치 찾기 및 삭제
for branch in $local_branches; {
  branch_name=$(echo $branch | sed 's/ //g') # 앞뒤 공백 제거
  if ! echo "$remote_branches" | grep -qw "$branch_name"; then
    echo "Deleting local branch: $branch_name"
    git branch -d "$branch_name"
  fi
}

