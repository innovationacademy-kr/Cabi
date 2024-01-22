package org.ftclub.cabinet.club.service;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
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
	private final ClubRegistrationQueryService clubRegistrationQueryService;
	private final ClubRegistrationCommandService clubRegistrationCommandService;
	private final UserQueryService userQueryService;

	private final ClubPolicyService clubPolicyService;


	@Transactional
	public void addClubUser(Long userId, Long clubId, String name) {
		User clubMaster = userQueryService.getUser(userId);
		User newClubUser = userQueryService.getUserByName(name);
		List<Long> clubUserIds = clubRegistrationQueryService.findClubUsersWithClub(clubId)
				.stream().map(ClubRegistration::getUserId).collect(Collectors.toList());

		clubPolicyService.verifyClubMaster(clubMaster.getRole());
		clubPolicyService.verifyClubUserIn(clubUserIds, clubMaster.getId());
		clubPolicyService.verifyClubUserNotIn(clubUserIds, newClubUser.getId());

		ClubRegistration clubRegistration = ClubRegistration.of(newClubUser.getId(), clubId);
		clubRegistrationCommandService.addNewClubUser(clubRegistration);
	}
}
