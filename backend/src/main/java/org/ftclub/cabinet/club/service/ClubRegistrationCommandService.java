package org.ftclub.cabinet.club.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.club.repository.ClubRegistrationRepoitory;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.UserRole;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubRegistrationCommandService {

	private final ClubRegistrationRepoitory clubRegistrationRepoitory;

	public void addNewClubUser(ClubRegistration clubRegistration) {
		clubRegistrationRepoitory.save(clubRegistration);
	}

	public void deleteClubUser(ClubRegistration clubRegistration) {
		clubRegistrationRepoitory.delete(clubRegistration);
	}

	public void mandateClubMaster(ClubRegistration oldClubRegistration,
			ClubRegistration newClubRegistration) {
		oldClubRegistration.changeUserRole(UserRole.CLUB);
		newClubRegistration.changeUserRole(UserRole.CLUB_ADMIN);
	}
}
