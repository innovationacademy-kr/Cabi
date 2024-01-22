package org.ftclub.cabinet.club.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.Club;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubFacadeService {

	private final ClubQueryService clubQueryService;
	private final ClubCommandService clubCommandService;
	private final ClubRegistrationCommandService clubRegistrationCommandService;
	private final UserQueryService userQueryService;


	@Transactional
	public void addClubUser(Long userId, Long clubId, String name) {
		User clubMaster = userQueryService.getUser(userId);
		Club club = clubQueryService.getClub(clubId);
		User newClubUser = userQueryService.getUserByName(name);

		ClubRegistration clubRegistration = ClubRegistration.of(newClubUser.getId(), clubId);
		clubRegistrationCommandService.addNewClubUser(clubRegistration);
	}
}
