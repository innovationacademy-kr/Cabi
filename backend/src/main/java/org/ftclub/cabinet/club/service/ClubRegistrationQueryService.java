package org.ftclub.cabinet.club.service;


import static org.ftclub.cabinet.user.domain.UserRole.CLUB_ADMIN;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.club.repository.ClubRegistrationRepoitory;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
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

	public List<ClubRegistration> findClubUsersWithClubByUser(Long userId) {
		return clubRegistrationRepoitory.findAllByUserIdJoinClub(userId);
	}

	public List<ClubRegistration> findClubUsersByClubs(List<Long> clubIds) {
		return clubRegistrationRepoitory.findAllByClubIdInJoinUser(clubIds);
	}

	public ClubRegistration getClubUser(Long userId, Long clubId) {
		return clubRegistrationRepoitory.findByClubIdAndUserId(userId,
				clubId).orElseThrow(ExceptionStatus.NOT_CLUB_USER::asServiceException);
	}

	public ClubRegistration getClubMasterByClub(Long clubId) {
		return clubRegistrationRepoitory.findByClubIdAndUserRoleJoinClubAndUser(clubId, CLUB_ADMIN)
				.orElseThrow(ExceptionStatus.NOT_CLUB_MASTER::asServiceException);
	}
}
