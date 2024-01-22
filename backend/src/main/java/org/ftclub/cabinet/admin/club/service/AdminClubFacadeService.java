package org.ftclub.cabinet.admin.club.service;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.Club;
import org.ftclub.cabinet.club.service.ClubCommandService;
import org.ftclub.cabinet.club.service.ClubQueryService;
import org.ftclub.cabinet.dto.ClubCreateDto;
import org.ftclub.cabinet.dto.ClubDeleteDto;
import org.ftclub.cabinet.dto.ClubInfoDto;
import org.ftclub.cabinet.dto.ClubInfoPaginationDto;
import org.ftclub.cabinet.dto.ClubUpdateRequestDto;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.ClubMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
@Transactional
public class AdminClubFacadeService {

	private final ClubQueryService clubQueryService;
	private final ClubCommandService clubCommandService;
	private final ClubMapper clubMapper;

	public ClubInfoPaginationDto findAllActiveClubsInfo(Pageable pageable) {
		Page<Club> clubs = clubQueryService.findAllActiveClubs(pageable);
		List<ClubInfoDto> result = clubs.stream().map(clubMapper::toClubInfoDto)
				.collect(Collectors.toList());
		return clubMapper.toClubInfoPaginationDto(result, clubs.getTotalElements());
	}

	public void createNewClub(ClubCreateDto clubCreateDto) {
		clubCommandService.createClub(clubCreateDto);
	}

	public void deleteClub(ClubDeleteDto clubDeleteDto) {
		Club club = clubQueryService.getClub(clubDeleteDto.getClubId());
		clubCommandService.deleteClub(club);
	}

	public void updateClub(Long clubId, ClubUpdateRequestDto clubUpdateRequestDto) {
		Club club = clubQueryService.getClub(clubId);
		clubCommandService.updateName(club, clubUpdateRequestDto);
	}

}
