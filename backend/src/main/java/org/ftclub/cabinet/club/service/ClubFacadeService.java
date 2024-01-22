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
	public void addClubUser(Long masterId, Long clubId, String name) {
		User clubMaster = userQueryService.getUser(masterId);
		ClubRegistration clubMasterRegistration = clubRegistrationQueryService.getClubUser(
				masterId);
		User newClubUser = userQueryService.getUserByName(name);
		List<Long> clubUserIds = clubRegistrationQueryService.findClubUsersWithClub(clubId)
				.stream().map(ClubRegistration::getUserId).collect(Collectors.toList());

		clubPolicyService.verifyClubUserIn(clubUserIds, clubMaster.getId());
		clubPolicyService.verifyClubUserNotIn(clubUserIds, newClubUser.getId());
		clubPolicyService.verifyClubMaster(clubMasterRegistration.getUserRole(),
				clubMasterRegistration.getClubId(), clubId);

		ClubRegistration clubRegistration = ClubRegistration.of(newClubUser.getId(), clubId);
		clubRegistrationCommandService.addNewClubUser(clubRegistration);
	}


	public void deleteClubUser(Long masterId, Long clubId, Long deletedUserId) {
		User clubMaster = userQueryService.getUser(masterId);
		userQueryService.getUser(deletedUserId);
		ClubRegistration clubMasterRegistration = clubRegistrationQueryService.getClubUser(
				masterId);
		ClubRegistration deletedUserRegistration =
				clubRegistrationQueryService.getClubUser(deletedUserId);
		List<Long> clubUserIds = clubRegistrationQueryService.findClubUsersWithClub(clubId)
				.stream().map(ClubRegistration::getUserId).collect(Collectors.toList());

		clubPolicyService.verifyClubUserIn(clubUserIds, clubMaster.getId());
		clubPolicyService.verifyClubUserIn(clubUserIds, deletedUserId);
		clubPolicyService.verifyClubMaster(clubMasterRegistration.getUserRole(),
				clubMasterRegistration.getClubId(), clubId);

		clubRegistrationCommandService.deleteClubUser(deletedUserRegistration);
	}

	public void mandateClubUser(Long clubMasterId, Long clubId, String newClubMasterName) {
		userQueryService.getUser(clubMasterId);
		User newClubMaster = userQueryService.getUserByName(newClubMasterName);
		ClubRegistration oldClubMasterRegistration =
				clubRegistrationQueryService.getClubUser(clubMasterId);
		ClubRegistration newClubMasterRegistration =
				clubRegistrationQueryService.getClubUser(newClubMaster.getId());
		List<Long> clubUserIds = clubRegistrationQueryService.findClubUsersWithClub(clubId)
				.stream().map(ClubRegistration::getUserId).collect(Collectors.toList());

		clubPolicyService.verifyClubUserIn(clubUserIds, newClubMaster.getId());
		clubPolicyService.verifyClubUserIn(clubUserIds, clubMasterId);
		clubPolicyService.verifyClubMaster(oldClubMasterRegistration.getUserRole(),
				oldClubMasterRegistration.getClubId(), clubId);

		clubRegistrationCommandService.mandateClubMaster(oldClubMasterRegistration,
				newClubMasterRegistration);
	}
}
