#!/bin/bash

# 기준이 될 branch, 필요에 따라 변경 가능
BASE_BRANCH="dev"
# 보호할 branch 목록, 필요하시면 더 추가하세여
PROTECTED_BRANCHES=("dev" "main")

echo "🔄 $BASE_BRANCH 로 체크아웃 "
git checkout $BASE_BRANCH >/dev/null 2>&1

echo "🔄 원격 브랜치 정보 최신화 (fetch + prune)"
git fetch --prune

echo ""
echo "🔍 $BASE_BRANCH 에 이미 병합된 로컬 브랜치 목록 (현재 브랜치: $BASE_BRANCH 제외):"
MERGED_BRANCHES=$(git branch --merged | grep -v "\*")

# 보호 브랜치 제외
for branch in "${PROTECTED_BRANCHES[@]}"; do
  MERGED_BRANCHES=$(echo "$MERGED_BRANCHES" | grep -v -w "$branch")
done

if [[ -z "$MERGED_BRANCHES" ]]; then
  echo "✅ 삭제할 병합된 브랜치가 없습니다."
  exit 0
fi

echo "$MERGED_BRANCHES"
echo ""
read -p "❓ 위 브랜치들을 로컬에서 삭제할까요? (y/n): " CONFIRM

if [[ "$CONFIRM" == "y" || "$CONFIRM" == "Y" ]]; then
  echo ""
  echo "🗑️ 삭제 중..."
  echo "$MERGED_BRANCHES" | xargs -n 1 git branch -d
  echo ""
  echo "🧹 불필요한 원격 브랜치 추적 정보 정리"
  git remote prune origin
  echo ""
  echo "✅ 브랜치 정리 완료!"
else
  echo "🚫 삭제를 취소했습니다."
fi
