package org.ftclub.cabinet.cabinet.newService;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.ActiveCabinetInfoEntities;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPreviewDto;
import org.ftclub.cabinet.dto.CabinetSimpleDto;
import org.ftclub.cabinet.dto.CabinetSimplePaginationDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
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

	/**
	 * @param visibleNum
	 * @return
	 */

	public CabinetSimplePaginationDto getCabinetsSimpleInfoByVisibleNum(Integer visibleNum) {
		log.debug("getCabinetsSimpleInfoByVisibleNum: {}", visibleNum);

		List<Cabinet> cabinets = cabinetQueryService.getCabinets(visibleNum);

		List<CabinetSimpleDto> cabinetSimpleDtos = cabinets.stream()
				.map(cabinetMapper::toCabinetSimpleDto)
				.collect(Collectors.toList());

		return CabinetSimplePaginationDto.builder()
				.totalLength((long) cabinets.size())
				.result(cabinetSimpleDtos)
				.build();
	}

	private String checkCabinetTitle(Cabinet cabinet, List<LentHistory> lentHistories) {
		if (cabinet.getTitle() != null && !cabinet.getTitle().isEmpty()) {
			return cabinet.getTitle();
		} else if (!lentHistories.isEmpty() && lentHistories.get(0).getUser() != null) {
			return lentHistories.get(0).getUser().getName();
		}
		return null;
	}


	/**
	 * 빌딩명과 층으로 섹션별 사물함 정보를 가져옵니다.
	 *
	 * @param building 빌딩 이름 (예: 새롬관)
	 * @param floor    빌딩에 있는 층
	 * @return 전달인자로 받은 건물,층 에 있는 모든 섹션별 사물함 정보
	 */
	@Transactional(readOnly = true)
	public List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building,
			Integer floor) {
		log.debug("getCabinetsPerSection: {}, {}", building, floor);
		List<ActiveCabinetInfoEntities> activeCabinetInfos = cabinetQueryService.findActiveCabinetInfoEntities(
				building, floor);
		Map<Cabinet, List<LentHistory>> cabinetLentHistories = activeCabinetInfos.stream().
				collect(groupingBy(ActiveCabinetInfoEntities::getCabinet,
						mapping(ActiveCabinetInfoEntities::getLentHistory,
								Collectors.toList())));
		List<Cabinet> allCabinetsOnSection =
				cabinetQueryService.findAllCabinetsByBuildingAndFloor(building, floor);

		Map<String, List<CabinetPreviewDto>> cabinetPreviewsBySection = new LinkedHashMap<>();
		allCabinetsOnSection.stream()
				.sorted(Comparator.comparing(Cabinet::getVisibleNum))
				.forEach(cabinet -> {
					String section = cabinet.getCabinetPlace().getLocation().getSection();
					List<LentHistory> lentHistories =
							cabinetLentHistories.getOrDefault(cabinet, Collections.emptyList());
					String title = checkCabinetTitle(cabinet, lentHistories);
					cabinetPreviewsBySection.computeIfAbsent(section, k -> new ArrayList<>())
							.add(cabinetMapper.toCabinetPreviewDto(cabinet, lentHistories.size(),
									title));
				});

		return cabinetPreviewsBySection.entrySet().stream()
				.map(entry -> cabinetMapper.toCabinetsPerSectionResponseDto(entry.getKey(),
						entry.getValue()))
				.collect(Collectors.toList());
	}

}
