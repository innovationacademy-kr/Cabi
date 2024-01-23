package org.ftclub.cabinet.admin.club.service;

import static java.util.stream.Collectors.toList;

import java.util.List;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.Club;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.club.service.ClubCommandService;
import org.ftclub.cabinet.club.service.ClubQueryService;
import org.ftclub.cabinet.club.service.ClubRegistrationCommandService;
import org.ftclub.cabinet.club.service.ClubRegistrationQueryService;
import org.ftclub.cabinet.dto.ClubDeleteDto;
import org.ftclub.cabinet.dto.ClubInfoDto;
import org.ftclub.cabinet.dto.ClubInfoPaginationDto;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.ClubMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
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


	public ClubInfoPaginationDto findAllActiveClubsInfo(Pageable pageable) {
		Page<Club> clubs = clubQueryService.findAllActiveClubs(pageable);
		List<ClubInfoDto> result = clubs.stream().map(clubMapper::toClubInfoDto).collect(toList());
		return clubMapper.toClubInfoPaginationDto(result, clubs.getTotalElements());
	}

	public void createNewClub(String clubName, String clubMasterName) {
		User clubMaster = userQueryService.getUserByName(clubMasterName);
		Club club = clubCommandService.createClub(clubName);
		clubRegistrationCommandService.addNewClubUser(
				ClubRegistration.of(clubMaster.getId(), club.getId(), UserRole.CLUB_ADMIN));
	}

	public void deleteClub(ClubDeleteDto clubDeleteDto) {
		Club club = clubQueryService.getClub(clubDeleteDto.getClubId());
		clubCommandService.deleteClub(club);
	}

	public void updateClub(Long clubId, String clubName, String clubMasterName) {
		Club club = clubQueryService.getClub(clubId);
		if (!clubName.equals(club.getName())) {
			clubCommandService.updateName(club, clubName);
		}

		ClubRegistration clubMasterRegistration =
				clubRegistrationQueryService.getClubMasterByClubWithUser(clubId);
		if (!clubMasterName.equals(clubMasterRegistration.getUser().getName())) {
			User newClubMaster = userQueryService.getUserByName(clubName);
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
