package org.ftclub.cabinet.admin.club.service;

import static org.ftclub.cabinet.club.domain.UserRole.CLUB_ADMIN;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.Club;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.club.domain.UserRole;
import org.ftclub.cabinet.club.service.ClubCommandService;
import org.ftclub.cabinet.club.service.ClubQueryService;
import org.ftclub.cabinet.club.service.ClubRegistrationCommandService;
import org.ftclub.cabinet.club.service.ClubRegistrationQueryService;
import org.ftclub.cabinet.dto.ClubInfoDto;
import org.ftclub.cabinet.dto.ClubInfoPaginationDto;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.ClubMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
@Transactional
public class AdminClubFacadeService {

	private final ClubMapper clubMapper;
	private final ClubQueryService clubQueryService;
	private final ClubCommandService clubCommandService;
	private final ClubRegistrationCommandService clubRegistrationCommandService;
	private final ClubRegistrationQueryService clubRegistrationQueryService;
	private final UserQueryService userQueryService;


	/**
	 * 현재 사물함을 대여 중인 모든 동아리 정보를 가져옵니다.
	 *
	 * @param pageable 페이징 정보
	 * @return 현재 사물함을 대여 중인 모든 동아리 정보
	 */
	public ClubInfoPaginationDto findAllActiveClubsInfo(Pageable pageable) {
		Page<Club> clubs = clubQueryService.findAllActiveClubs(pageable);
		List<Long> clubIds = clubs.stream().map(Club::getId)
				.collect(Collectors.toList());
		Map<Long, List<ClubRegistration>> clubMasterMap =
				clubRegistrationQueryService.findClubUsersByClubs(clubIds)
						.stream().collect(Collectors.groupingBy(ClubRegistration::getClubId));

		List<ClubInfoDto> result = clubs.stream().map(club -> {
			Long clubId = club.getId();
			String clubName = club.getName();
			String clubMasterName = clubMasterMap.get(clubId).stream()
					.filter(c -> c.getUserRole().equals(CLUB_ADMIN))
					.map(c -> c.getUser().getName()).findFirst().orElse(null);
			return clubMapper.toClubInfoDto(clubId, clubName, clubMasterName);
		}).collect(Collectors.toList());
		return clubMapper.toClubInfoPaginationDto(result, clubs.getTotalElements());
	}

	/**
	 * 동아리를 생성합니다.
	 *
	 * @param clubName       동아리 이름
	 * @param clubMasterName 동아리장 이름
	 */
	public void createNewClub(String clubName, String clubMasterName) {
		User clubMaster = userQueryService.getUserByName(clubMasterName);
		Club club = clubCommandService.createClub(clubName);
		clubRegistrationCommandService.addNewClubUser(
				ClubRegistration.of(clubMaster.getId(), club.getId(), UserRole.CLUB_ADMIN));
	}

	/**
	 * 동아리를 삭제합니다.
	 *
	 * @param clubId 동아리 ID
	 */
	public void deleteClub(Long clubId) {
		Club club = clubQueryService.getClub(clubId);
		clubCommandService.deleteClub(club);
		List<ClubRegistration> clubUsersByClub = clubRegistrationQueryService.findClubUsersByClub(
				clubId);
		clubUsersByClub.forEach(clubRegistrationCommandService::deleteClubUser);
	}

	/**
	 * 동아리 정보를 수정합니다.
	 *
	 * @param clubId         동아리 ID
	 * @param clubName       변경할 동아리 이름
	 * @param clubMasterName 변경할 동아리장 이름
	 */
	public void updateClub(Long clubId, String clubName, String clubMasterName) {
		Club club = clubQueryService.getClub(clubId);
		if (!clubName.equals(club.getName())) {
			clubCommandService.updateName(club, clubName);
		}

		ClubRegistration clubMasterRegistration =
				clubRegistrationQueryService.getClubMasterByClubWithUser(clubId);
		if (!clubMasterName.equals(clubMasterRegistration.getUser().getName())) {
			User newClubMaster = userQueryService.getUserByName(clubMasterName);
			ClubRegistration newClubMasterRegistration =
					clubRegistrationQueryService.getClubUser(newClubMaster.getId(), clubId);

			if (newClubMasterRegistration == null) {
				newClubMasterRegistration = clubRegistrationCommandService.addNewClubUser(
						ClubRegistration.of(clubId, newClubMaster.getId(), UserRole.CLUB_ADMIN));
			}
			clubRegistrationCommandService.mandateClubMaster(clubMasterRegistration,
					newClubMasterRegistration);
		}
	}
}
