package org.ftclub.cabinet.cabinet.newService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.lent.service.LentRedisService;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.newService.UserQueryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
public class CabinetFacadeService {

	private final CabinetCommandService cabinetCommandService;
	private final CabinetQueryService cabinetQueryService;

	private final LentQueryService lentQueryService;
	private final LentRedisService lentRedisService;
	private final UserQueryService userQueryService;

	private final CabinetMapper cabinetMapper;
	private final LentMapper lentMapper;

	/**
	 * {@inheritDoc}
	 * <p>
	 * 존재하는 모든 건물들을 가져오고, 각 건물별 층 정보들을 가져옵니다.
	 */
	@Transactional(readOnly = true)
	public List<BuildingFloorsDto> getBuildingFloorsResponse() {
		log.debug("getBuildingFloorsResponse");
		List<String> allBuildings = cabinetQueryService.getAllBuildings();
		return allBuildings.stream()
				.map(building -> cabinetMapper.toBuildingFloorsDto(building,
						cabinetQueryService.getAllFloorsByBuilding(building))
				)
				.collect(Collectors.toList());
	}

	/**
	 * {@inheritDoc} 사물함 id로 사물함 정보를 가져옵니다. active 대여기록이 없는경우, IN_SESSION 상태의 사물함인지 확인합니다.
	 */
	public CabinetInfoResponseDto getCabinetInfo(Long cabinetId) {
		log.debug("getCabinetInfo: {}", cabinetId);
		List<LentDto> lentDtos = new ArrayList<>();

		List<LentHistory> cabinetActiveLentHistories = lentQueryService.findCabinetActiveLentHistories(
				cabinetId);

		cabinetActiveLentHistories.stream().map(lentHistory -> lentDtos.add(
				lentMapper.toLentDto(lentHistory.getUser(), lentHistory)));

		if (cabinetActiveLentHistories.isEmpty()) {
			List<Long> usersInCabinet = lentRedisService.findUsersInCabinet(cabinetId);
			List<User> users = userQueryService.getUsers(usersInCabinet);
			users.stream().map(user -> lentDtos.add(
					LentDto.builder().userId(user.getUserId()).name(user.getName()).build()
			));
		}

		return cabinetMapper.toCabinetInfoResponseDto(
				cabinetQueryService.findUserActiveCabinet(cabinetId), lentDtos,
				lentRedisService.getSessionExpired(cabinetId));
	}


}
