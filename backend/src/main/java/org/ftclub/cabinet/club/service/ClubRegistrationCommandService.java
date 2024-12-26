package org.ftclub.cabinet.club.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.club.domain.UserRole;
import org.ftclub.cabinet.club.repository.ClubRegistrationRepoitory;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubRegistrationCommandService {

	private final ClubRegistrationRepoitory clubRegistrationRepoitory;

	/**
	 * 동아리 회원을 추가한다.
	 *
	 * @param clubRegistration 동아리 회원 정보
	 * @return 동아리 회원 정보
	 */
	public ClubRegistration addNewClubUser(ClubRegistration clubRegistration) {
		return clubRegistrationRepoitory.save(clubRegistration);
	}

	/**
	 * 동아리 회원을 삭제한다.
	 *
	 * @param clubRegistration 동아리 회원 정보
	 */
	public void deleteClubUser(ClubRegistration clubRegistration) {
		clubRegistration.delete();
	}

	/**
	 * 동아리장을 위임한다.
	 *
	 * @param oldClubRegistration 기존 동아리장 정보
	 * @param newClubRegistration 새 동아리장 정보
	 */
	public void mandateClubMaster(ClubRegistration oldClubRegistration,
			ClubRegistration newClubRegistration) {
		oldClubRegistration.changeUserRole(UserRole.CLUB);
		newClubRegistration.changeUserRole(UserRole.CLUB_ADMIN);
	}
}
