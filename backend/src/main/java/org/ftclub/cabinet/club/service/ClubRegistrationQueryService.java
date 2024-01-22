package org.ftclub.cabinet.club.service;


import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.club.repository.ClubRegistrationRepoitory;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.UserRole;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubRegistrationQueryService {

	private final ClubRegistrationRepoitory clubRegistrationRepoitory;

	public List<ClubRegistration> findClubUsersByClub(Long clubId) {
		return clubRegistrationRepoitory.findAllByClubId(clubId);
	}

	public ClubRegistration getClubUserByUser(Long userId) {
		Optional<ClubRegistration> clubRegistration =
				clubRegistrationRepoitory.findByUserId(userId);
		return clubRegistration.orElseThrow(ExceptionStatus.NOT_CLUB_USER::asServiceException);
	}

	public List<ClubRegistration> findClubUsersWithClub(Long userId) {
		return clubRegistrationRepoitory.findAllByUserIdJoinClub(userId);
	}

	public List<ClubRegistration> findClubUsersByClubIn(List<Long> clubIds) {
		return clubRegistrationRepoitory.findAllByClubIdInJoinUser(clubIds);
	}

	public ClubRegistration getClubUserByUserAndClub(Long userId, Long clubId) {
		return clubRegistrationRepoitory.findByClubIdAndUserId(userId,
				clubId).orElseThrow(ExceptionStatus.NOT_CLUB_USER::asServiceException);
	}

	public ClubRegistration findClubUserByUserAndClub(Long userId, Long clubId) {
		return clubRegistrationRepoitory.findByClubIdAndUserId(userId,
				clubId).orElse(null);
	}

	public ClubRegistration getClubMasterByClubId(Long clubId) {
		return clubRegistrationRepoitory.findByClubIdAndUserRole(clubId, UserRole.CLUB_ADMIN)
				.orElseThrow(ExceptionStatus.INVALID_CLUB_MASTER::asServiceException);
	}
}
