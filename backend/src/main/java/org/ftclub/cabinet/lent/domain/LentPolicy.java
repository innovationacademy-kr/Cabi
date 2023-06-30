package org.ftclub.cabinet.lent.domain;

import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;

/**
 * lent정책과 관련된 class
 */
public interface LentPolicy {

	/**
	 * 적절한 만료일을 만들어냅니다
	 *
	 * @param now                 현재 시각
	 * @param cabinet             대여하려는 사물함
	 * @param activeLentHistories 대여 하려는 사물함의 이전 대여 하고있었던 기록들 없다면 빈 리스트
	 * @return cabinet을 빌릴 때 들어가야 하는 만료일
	 */
	LocalDateTime generateExpirationDate(LocalDateTime now, Cabinet cabinet,
			List<LentHistory> activeLentHistories);


	/**
	 * 만료일을 @{@link LentHistory}에 적용시킵니다. 현재와 과거의 기록들에 적용합니다.
	 *
	 * @param curHistory            현재 대여 기록
	 * @param beforeActiveHistories 이전 대여 하고있는 기록들 없다면 빈 리스트
	 * @param expiredAt             적용하려는 만료일
	 */
	void applyExpirationDate(LentHistory curHistory, List<LentHistory> beforeActiveHistories,
			LocalDateTime expiredAt);

	/**
	 * 대여할 수 있는 유저인지 확인합니다.
	 *
	 * @param user                대여를 하려는 유저
	 * @param cabinet             대여를 하려는 사물함
	 * @param userActiveLentCount 유저가 빌리고 있는 사물함 개수
	 * @param userActiveBanList   유저의 벤 당하고 있는 리스트 없다면 빈 리스트
	 * @return {@link LentPolicyStatus} 현재 대여의 상태
	 */
	LentPolicyStatus verifyUserForLent(User user, Cabinet cabinet, int userActiveLentCount,
			List<BanHistory> userActiveBanList);

	/**
	 * 대여할 수 있는 사물함인지 확인합니다.
	 *
	 * @param cabinet              대여하려는 사물함
	 * @param cabinetLentHistories 대여하려는 사물함을 빌리고 있는 기록들 없다면 빈리스트
	 * @param now                  현재 시각
	 * @return {@link LentPolicyStatus}
	 */
	LentPolicyStatus verifyCabinetForLent(Cabinet cabinet,
			List<LentHistory> cabinetLentHistories, LocalDateTime now);

	/**
	 * @return 개인 사물함을 대여 할 수 있는 날
	 */
	Integer getDaysForLentTermPrivate();

	/**
	 * @return 공유 사물함을 대여 할 수 있는 날
	 */
	Integer getDaysForLentTermShare();

	/**
	 * @return 만료가 임박하여 공유 사물함을 빌릴 수 없는 날
	 */
	Integer getDaysForNearExpiration();
}
