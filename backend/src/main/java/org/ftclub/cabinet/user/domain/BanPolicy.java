package org.ftclub.cabinet.user.domain;

import java.util.Date;
import org.ftclub.cabinet.cabinet.domain.LentType;

public interface BanPolicy {

	/**
	 * 유저의 대여 기록을 검증하여 정지 유형을 반환합니다.
	 *
	 * @param lentType  대여 유형
	 * @param startAt   대여 시작 시간
	 * @param endedAt   대여 종료 시간
	 * @param expiredAt 대여 만료 시간
	 * @return 정지 유형을 반환합니다.
	 */
	BanType verifyForBanType(LentType lentType, Date startAt, Date endedAt, Date expiredAt);

	/**
	 * 정지 유형에 따라 정지 기간을 반환합니다.
	 *
	 * @param banType   정지 유형
	 * @param endedAt   대여 종료 시간
	 * @param expiredAt 대여 만료 시간
	 * @return unbannedAt을 반환합니다.
	 */
	Date getBanDate(BanType banType, Date endedAt, Date expiredAt, Long userId);

	/**
	 * 이미 만료된 대여 기록인지 확인합니다.
	 *
	 * @param endedAt   대여 종료 시간
	 * @param expiredAt 대여 만료 시간
	 * @return 만료된 대여 기록이라면 true를 반환합니다.
	 */
	boolean checkAlreadyExpired(Date endedAt, Date expiredAt);

	/**
	 * Active한 banHistory인지 확인합니다.
	 *
	 * @param unbannedAt
	 * @param now
	 * @return 현재 Active한 banHistory라면 true를 반환합니다.
	 */
	boolean isActiveBanHistory(Date unbannedAt, Date now);

	/**
	 * 유저의 누적 정지일을 가져옵니다.
	 *
	 * @param userId 유저 아이디
	 * @return 누적 정지일
	 */
	Long getAccumulateBanDaysByUserId(Long userId);
}
