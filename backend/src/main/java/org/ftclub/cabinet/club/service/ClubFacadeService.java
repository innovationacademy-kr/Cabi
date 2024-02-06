package org.ftclub.cabinet.club.service;

import static org.ftclub.cabinet.user.domain.UserRole.CLUB_ADMIN;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.service.CabinetCommandService;
import org.ftclub.cabinet.club.domain.Club;
import org.ftclub.cabinet.club.domain.ClubLentHistory;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.dto.ClubInfoDto;
import org.ftclub.cabinet.dto.ClubInfoPaginationDto;
import org.ftclub.cabinet.dto.ClubInfoResponseDto;
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
	private final ClubCommandService clubCommandService;
	private final ClubRegistrationQueryService clubRegistrationQueryService;
	private final ClubRegistrationCommandService clubRegistrationCommandService;
	private final ClubLentQueryService clubLentQueryService;
	private final UserQueryService userQueryService;
	private final CabinetCommandService cabinetCommandService;

	private final ClubPolicyService clubPolicyService;

	private final ClubMapper clubMapper;


	/**
	 * 동아리 정보를 조회한다.
	 *
	 * @param userId   사용자 ID
	 * @param clubId   동아리 ID
	 * @param pageable 페이징 정보
	 * @return 동아리 정보
	 */
	@Transactional(readOnly = true)
	public ClubInfoResponseDto getClubInfo(Long userId, Long clubId, Pageable pageable) {
		Club club = clubQueryService.getClubWithClubRegistration(clubId);
		List<Long> clubUserIds = club.getClubRegistrations().stream()
				.filter(cr -> cr.getDeletedAt() == null)
				.map(ClubRegistration::getUserId).collect(Collectors.toList());
		Long clubMasterId = club.getClubRegistrations().stream()
				.filter(cr -> cr.getUserRole().equals(CLUB_ADMIN))
				.map(ClubRegistration::getUserId).findFirst()
				.orElseThrow(ExceptionStatus.INVALID_CLUB_MASTER::asServiceException);

		clubPolicyService.verifyClubUserIn(clubUserIds, userId);

		Page<User> userMap = userQueryService.findUsers(clubUserIds, pageable);
		User clubMaster =
				clubRegistrationQueryService.getClubUserByUser(clubMasterId, clubId).getUser();
		ClubUserResponseDto clubMasterDto =
				clubMapper.toClubUserResponseDto(clubMaster.getId(), clubMaster.getName());
		Cabinet clubCabinet =
				clubLentQueryService.getActiveLentHistoryWithCabinet(clubId).getCabinet();

		List<ClubUserResponseDto> clubUsers = userMap.stream()
				.map(user -> clubMapper.toClubUserResponseDto(user.getId(), user.getName()))
				.collect(Collectors.toList());
		return clubMapper.toClubInfoResponseDto(club.getName(), clubMasterDto,
				club.getNotice(), clubCabinet, clubUsers, userMap.getTotalElements());
	}

	/**
	 * 내가 속한 동아리 목록을 조회한다.
	 *
	 * @param userId 사용자 ID
	 * @return 내가 속한 동아리 목록
	 */
	@Transactional(readOnly = true)
	public ClubInfoPaginationDto getMyClubs(Long userId) {
		List<ClubRegistration> usersWithClub =
				clubRegistrationQueryService.findClubUsersWithClubByUser(userId);
		List<Long> clubIds = usersWithClub.stream().map(ClubRegistration::getClubId)
				.collect(Collectors.toList());
		Map<Long, List<ClubRegistration>> clubMasterMap =
				clubRegistrationQueryService.findClubUsersByClubs(clubIds)
						.stream().collect(Collectors.groupingBy(ClubRegistration::getClubId));

		List<ClubInfoDto> result = usersWithClub.stream().map(cr -> {
			Long clubId = cr.getClubId();
			String clubName = cr.getClub().getName();
			String clubMasterName = clubMasterMap.get(clubId).stream()
					.filter(c -> c.getUserRole().equals(CLUB_ADMIN))
					.map(c -> c.getUser().getName()).findFirst().orElse(null);
			return clubMapper.toClubInfoDto(clubId, clubName, clubMasterName);
		}).collect(Collectors.toList());
		return clubMapper.toClubInfoPaginationDto(result, (long) result.size());
	}

	/**
	 * 동아리에 사용자를 추가한다.
	 *
	 * @param masterId 동아리 마스터 ID
	 * @param clubId   동아리 ID
	 * @param name     추가할 사용자 이름
	 */
	@Transactional
	public void addClubUser(Long masterId, Long clubId, String name) {
		User clubMaster = userQueryService.getUser(masterId);
		ClubRegistration clubMasterRegistration =
				clubRegistrationQueryService.getClubUserByUser(masterId, clubId);
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

	/**
	 * 동아리에서 사용자를 제거한다.
	 *
	 * @param masterId      동아리 마스터 ID
	 * @param clubId        동아리 ID
	 * @param deletedUserId 제거할 사용자 ID
	 */
	@Transactional
	public void deleteClubUser(Long masterId, Long clubId, Long deletedUserId) {
		User clubMaster = userQueryService.getUser(masterId);
		userQueryService.getUser(deletedUserId);
		ClubRegistration clubMasterRegistration =
				clubRegistrationQueryService.getClubUserByUser(masterId, clubId);
		ClubRegistration deletedUserRegistration =
				clubRegistrationQueryService.getClubUserByUser(deletedUserId, clubId);
		List<Long> clubUserIds = clubRegistrationQueryService.findClubUsersByClub(clubId)
				.stream().map(ClubRegistration::getUserId).collect(Collectors.toList());

		clubPolicyService.verifyClubUserIn(clubUserIds, clubMaster.getId());
		clubPolicyService.verifyClubUserIn(clubUserIds, deletedUserId);
		clubPolicyService.verifyClubMaster(clubMasterRegistration.getUserRole(),
				clubMasterRegistration.getClubId(), clubId);

		clubRegistrationCommandService.deleteClubUser(deletedUserRegistration);
	}

	/**
	 * 동아리 마스터를 위임한다.
	 *
	 * @param clubMasterId      동아리 마스터 ID
	 * @param clubId            동아리 ID
	 * @param newClubMasterName 새로운 동아리 마스터 이름
	 */
	@Transactional
	public void mandateClubUser(Long clubMasterId, Long clubId, String newClubMasterName) {
		User newClubMaster = userQueryService.getUserByName(newClubMasterName);

		ClubRegistration oldClubMasterRegistration =
				clubRegistrationQueryService.getClubUserByUser(clubMasterId, clubId);
		ClubRegistration newClubMasterRegistration =
				clubRegistrationQueryService.getClubUserByUser(newClubMaster.getId(), clubId);
		List<Long> clubUserIds = clubRegistrationQueryService.findClubUsersByClub(clubId)
				.stream().map(ClubRegistration::getUserId).collect(Collectors.toList());

		clubPolicyService.verifyClubUserIn(clubUserIds, newClubMaster.getId());
		clubPolicyService.verifyClubUserIn(clubUserIds, clubMasterId);
		clubPolicyService.verifyClubMaster(oldClubMasterRegistration.getUserRole(),
				oldClubMasterRegistration.getClubId(), clubId);

		clubRegistrationCommandService.mandateClubMaster(oldClubMasterRegistration,
				newClubMasterRegistration);
	}

	public void updateClubNotice(Long userId, Long clubId, String notice) {
		ClubRegistration clubMasterRegistration
				= clubRegistrationQueryService.getClubUserByUser(userId, clubId);
		Club club = clubQueryService.getClub(clubId);

		clubPolicyService.verifyClubMaster(clubMasterRegistration.getUserRole(),
				clubMasterRegistration.getClubId(), clubId);

		clubCommandService.changeClubNotice(club, notice);
	}

	public void updateClubMemo(Long userId, Long clubId, String memo) {
		ClubRegistration clubMasterRegistration
				= clubRegistrationQueryService.getClubUserByUser(userId, clubId);
		Club club = clubQueryService.getClub(clubId);

		clubPolicyService.verifyClubMaster(clubMasterRegistration.getUserRole(),
				clubMasterRegistration.getClubId(), club.getId());

		ClubLentHistory clubLentHistory =
				clubLentQueryService.getActiveLentHistoryWithCabinet(clubId);
		cabinetCommandService.updateMemo(clubLentHistory.getCabinet(), memo);
	}
}
