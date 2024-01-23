package org.ftclub.cabinet.club.service;

import static org.ftclub.cabinet.user.domain.UserRole.CLUB_ADMIN;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.club.domain.Club;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.dto.ClubInfoResponseDto;
import org.ftclub.cabinet.dto.ClubPaginationResponseDto;
import org.ftclub.cabinet.dto.ClubResponseDto;
import org.ftclub.cabinet.dto.ClubUserResponseDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.service.ClubLentQueryService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.ClubMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubFacadeService {

	private final ClubQueryService clubQueryService;
	private final ClubRegistrationQueryService clubRegistrationQueryService;
	private final ClubRegistrationCommandService clubRegistrationCommandService;
	private final ClubLentQueryService clubLentQueryService;
	private final UserQueryService userQueryService;

	private final ClubPolicyService clubPolicyService;

	private final ClubMapper clubMapper;


	public ClubPaginationResponseDto getMyClubs(Long userId) {
		List<ClubRegistration> usersWithClub =
				clubRegistrationQueryService.findClubUsersWithClubByUser(userId);
		List<Long> clubIds = usersWithClub.stream().map(ClubRegistration::getClubId)
				.collect(Collectors.toList());
		Map<Long, List<ClubRegistration>> clubMasterMap =
				clubRegistrationQueryService.findClubUsersByClubs(clubIds)
						.stream().collect(Collectors.groupingBy(ClubRegistration::getClubId));

		List<ClubResponseDto> result = usersWithClub.stream().map(cr -> {
			Long clubId = cr.getClubId();
			String clubName = cr.getClub().getName();
			String clubMasterName = clubMasterMap.get(clubId).stream()
					.filter(c -> c.getUserRole().equals(CLUB_ADMIN))
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

	public ClubInfoResponseDto getClubInfo(Long userId, Long clubId, Pageable pageable) {
		Club club = clubQueryService.getClubWithClubRegistration(clubId);
		List<Long> clubUserIds = club.getClubRegistrations().stream()
				.map(ClubRegistration::getUserId).collect(Collectors.toList());
		Long clubMasterId = club.getClubRegistrations().stream()
				.filter(cr -> cr.getUserRole().equals(CLUB_ADMIN))
				.map(ClubRegistration::getUserId).findFirst()
				.orElseThrow(ExceptionStatus.INVALID_CLUB_MASTER::asServiceException);

		clubPolicyService.verifyClubUserIn(clubUserIds, userId);

		Page<User> userMap = userQueryService.getUsers(clubUserIds, pageable);
		User clubMaster = userMap.stream()
				.filter(u -> u.getId().equals(clubMasterId)).findFirst()
				.orElseThrow(ExceptionStatus.INVALID_CLUB_MASTER::asServiceException);
		Cabinet clubCabinet =
				clubLentQueryService.getActiveLentHistoryWithCabinet(clubId).getCabinet();

		List<ClubUserResponseDto> clubUsers = userMap.stream()
				.map(user -> clubMapper.toClubUserResponseDto(user.getId(), user.getName()))
				.collect(Collectors.toList());
		return clubMapper.toClubInfoResponseDto(club.getName(), clubMaster.getName(), clubCabinet,
				clubUsers, userMap.getTotalElements());
	}
}
