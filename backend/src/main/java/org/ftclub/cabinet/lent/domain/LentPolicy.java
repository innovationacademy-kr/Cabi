package org.ftclub.cabinet.lent.domain;

import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;

/**
 * lent정책과 관련된 class
 */
public interface LentPolicy {

	/**
	 * @param now            : 현재 시각
	 * @param totalUserCount : 공유사물함에 성공적으로 등록된 유저 수
	 * @return
	 */
	LocalDateTime generateSharedCabinetExpirationDate(LocalDateTime now,
			Integer totalUserCount);

	/**
	 * 적절한 만료일을 만들어냅니다
	 *
	 * @param now     현재 시각
	 * @param cabinet 대여하려는 사물함
	 * @return cabinet을 빌릴 때 들어가야 하는 만료일
	 */
	LocalDateTime generateExpirationDate(LocalDateTime now, Cabinet cabinet);

	/**
	 * @param now
	 * @return
	 */
	LocalDateTime generateExtendedExpirationDate(LocalDateTime now);

	/**
	 * 만료일을 @{@link LentHistory}에 적용시킵니다. 현재와 과거의 기록들에 적용합니다.
	 *
	 * @param curHistory 현재 대여 기록
	 * @param expiredAt  적용하려는 만료일
	 */
	void applyExpirationDate(LentHistory curHistory, LocalDateTime expiredAt);

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

	LentPolicyStatus verifyUserForLentShare(User user, Cabinet cabinet, int userActiveLentCount,
			List<BanHistory> userActiveBanList);

	/**
	 * 대여할 수 있는 사물함인지 확인합니다.
	 *
	 * @param cabinet 대여하려는 사물함
	 * @return {@link LentPolicyStatus}
	 */
	LentPolicyStatus verifyCabinetForLent(Cabinet cabinet);

	/**
	 * @return 개인 사물함을 대여 할 수 있는 날
	 */
	Integer getDaysForLentTermPrivate();

	/**
	 * @return 공유 사물함을 대여 할 수 있는 날
	 */
	Integer getDaysForLentTermShare(Integer totalUserCount);

	/**
	 * @return 사물함 대여 기간 연장 가능한 날
	 */
	int getDaysForTermExtend();

	/**
	 * @return 만료가 임박하여 공유 사물함을 빌릴 수 없는 날
	 */
	Integer getDaysForNearExpiration();

	/**
	 * 정책에 대한 결과 상태({@link LentPolicyStatus})에 맞는 적절한 {@link ServiceException}을 throw합니다.
	 *
	 * @param status     정책에 대한 결과 상태
	 * @param banHistory 유저의 ban history
	 */
	void handlePolicyStatus(LentPolicyStatus status, List<BanHistory> banHistory);

}
