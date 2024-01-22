package org.ftclub.cabinet.club.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.dto.ClubPaginationResponseDto;
import org.ftclub.cabinet.dto.ClubResponseDto;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.ClubMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
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

	private final ClubMapper clubMapper;


	public ClubPaginationResponseDto getMyClubs(Long userId) {
		List<ClubRegistration> usersWithClub =
				clubRegistrationQueryService.findClubUsersWithClub(userId);
		List<Long> clubIds = usersWithClub.stream().map(ClubRegistration::getClubId)
				.collect(Collectors.toList());
		Map<Long, List<ClubRegistration>> clubMasterMap =
				clubRegistrationQueryService.findClubUsersByClubIn(clubIds)
						.stream().collect(Collectors.groupingBy(ClubRegistration::getClubId));

		List<ClubResponseDto> result = usersWithClub.stream().map(cr -> {
			Long clubId = cr.getClubId();
			String clubName = cr.getClub().getName();
			String clubMasterName = clubMasterMap.get(clubId).stream()
					.filter(c -> c.getUserRole().equals(UserRole.CLUB_ADMIN))
					.map(c -> c.getUser().getName()).findFirst().orElse(null);
			return clubMapper.toClubResponseDto(clubId, clubName, clubMasterName);
		}).collect(Collectors.toList());
		return clubMapper.toClubPaginationResponseDto(result, (long) result.size());
	}

	@Transactional
	public void addClubUser(Long masterId, Long clubId, String name) {
		User clubMaster = userQueryService.getUser(masterId);
		ClubRegistration clubMasterRegistration = clubRegistrationQueryService.getClubUserByUser(
				masterId);
		User newClubUser = userQueryService.getUserByName(name);
		List<Long> clubUserIds = clubRegistrationQueryService.findClubUsersByClub(clubId)
				.stream().map(ClubRegistration::getUserId).collect(Collectors.toList());

		clubPolicyService.verifyClubUserIn(clubUserIds, clubMaster.getId());
		clubPolicyService.verifyClubUserNotIn(clubUserIds, newClubUser.getId());
		clubPolicyService.verifyClubMaster(clubMasterRegistration.getUserRole(),
				clubMasterRegistration.getClubId(), clubId);

		ClubRegistration clubRegistration = ClubRegistration.of(newClubUser.getId(), clubId,
				UserRole.CLUB);
		clubRegistrationCommandService.addNewClubUser(clubRegistration);
	}


	public void deleteClubUser(Long masterId, Long clubId, Long deletedUserId) {
		User clubMaster = userQueryService.getUser(masterId);
		userQueryService.getUser(deletedUserId);
		ClubRegistration clubMasterRegistration = clubRegistrationQueryService.getClubUserByUser(
				masterId);
		ClubRegistration deletedUserRegistration =
				clubRegistrationQueryService.getClubUserByUser(deletedUserId);
		List<Long> clubUserIds = clubRegistrationQueryService.findClubUsersByClub(clubId)
				.stream().map(ClubRegistration::getUserId).collect(Collectors.toList());

		clubPolicyService.verifyClubUserIn(clubUserIds, clubMaster.getId());
		clubPolicyService.verifyClubUserIn(clubUserIds, deletedUserId);
		clubPolicyService.verifyClubMaster(clubMasterRegistration.getUserRole(),
				clubMasterRegistration.getClubId(), clubId);

		clubRegistrationCommandService.deleteClubUser(deletedUserRegistration);
	}

	public void mandateClubUser(Long clubMasterId, Long clubId, String newClubMasterName) {
		User newClubMaster = userQueryService.getUserByName(newClubMasterName);

		ClubRegistration oldClubMasterRegistration =
				clubRegistrationQueryService.getClubUserByUser(clubMasterId);
		ClubRegistration newClubMasterRegistration =
				clubRegistrationQueryService.getClubUserByUser(newClubMaster.getId());
		List<Long> clubUserIds = clubRegistrationQueryService.findClubUsersByClub(clubId)
				.stream().map(ClubRegistration::getUserId).collect(Collectors.toList());

		clubPolicyService.verifyClubUserIn(clubUserIds, newClubMaster.getId());
		clubPolicyService.verifyClubUserIn(clubUserIds, clubMasterId);
		clubPolicyService.verifyClubMaster(oldClubMasterRegistration.getUserRole(),
				oldClubMasterRegistration.getClubId(), clubId);

		clubRegistrationCommandService.mandateClubMaster(oldClubMasterRegistration,
				newClubMasterRegistration);
	}
}
