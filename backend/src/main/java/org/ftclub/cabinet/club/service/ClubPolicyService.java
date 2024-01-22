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

	public void verifyClubMaster(UserRole masterRole) {
		if (!masterRole.equals(UserRole.CLUB_ADMIN)) {
			throw ExceptionStatus.INVALID_CLUB_MASTER.asServiceException();
		}
	}

	public void verifyClubUserIn(List<Long> clubUserIds, Long userId) {
		if (!clubUserIds.contains(userId)) {
			throw ExceptionStatus.NOT_CLUB_USER.asServiceException();
		}
	}

	public void verifyClubUserNotIn(List<Long> clubUserIds, Long userId) {
		if (clubUserIds.contains(userId)) {
			throw ExceptionStatus.USER_ALREADY_EXISTED.asServiceException();
		}
	}
}
