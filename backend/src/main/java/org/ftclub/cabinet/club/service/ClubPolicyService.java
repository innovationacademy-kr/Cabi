package org.ftclub.cabinet.club.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.UserRole;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubPolicyService {

	/**
	 * 동아리 마스터 권한을 검증한다.
	 *
	 * @param masterRole  동아리 마스터 권한
	 * @param clubId      마스터가 속한 동아리 ID
	 * @param inputClubId 입력받은 동아리 ID
	 */
	public void verifyClubMaster(UserRole masterRole, Long clubId, Long inputClubId) {
		if (!masterRole.equals(UserRole.CLUB_ADMIN)) {
			throw ExceptionStatus.NOT_CLUB_MASTER.asServiceException();
		}
		if (!clubId.equals(inputClubId)) {
			throw ExceptionStatus.INVALID_CLUB.asServiceException();
		}
	}

	/**
	 * 동아리에 속한 사용자인지 검증한다.
	 *
	 * @param clubUserIds 동아리에 속한 사용자 ID 목록
	 * @param userId      사용자 ID
	 */
	public void verifyClubUserIn(List<Long> clubUserIds, Long userId) {
		if (!clubUserIds.contains(userId)) {
			throw ExceptionStatus.NOT_CLUB_USER.asServiceException();
		}
	}

	/**
	 * 동아리에 속해있지 않은 사용자인지 검증한다.
	 *
	 * @param clubUserIds 동아리에 속한 사용자 ID 목록
	 * @param userId      사용자 ID
	 */
	public void verifyClubUserNotIn(List<Long> clubUserIds, Long userId) {
		if (clubUserIds.contains(userId)) {
			throw ExceptionStatus.USER_ALREADY_EXISTED.asServiceException();
		}
	}
}
