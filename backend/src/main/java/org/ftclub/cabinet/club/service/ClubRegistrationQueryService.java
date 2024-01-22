package org.ftclub.cabinet.club.service;


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

	public List<ClubRegistration> findClubUsersWithClub(Long clubId) {
		return clubRegistrationRepoitory.findAllByClubId(clubId);
	}

	public ClubRegistration getClubUser(Long userId) {
		Optional<ClubRegistration> clubRegistration = clubRegistrationRepoitory.findByUserId(
				userId);
		return clubRegistration.orElseThrow(ExceptionStatus.NOT_CLUB_USER::asServiceException);
	}
}
