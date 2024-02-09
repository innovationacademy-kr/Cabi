package org.ftclub.cabinet.cabinet.service;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;
import static java.util.stream.Collectors.toMap;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.AVAILABLE;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.PENDING;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.club.domain.Club;
import org.ftclub.cabinet.club.domain.ClubLentHistory;
import org.ftclub.cabinet.club.service.ClubQueryService;
import org.ftclub.cabinet.dto.ActiveCabinetInfoEntities;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPaginationDto;
import org.ftclub.cabinet.dto.CabinetPendingResponseDto;
import org.ftclub.cabinet.dto.CabinetPreviewDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.ClubLentQueryService;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.lent.service.LentRedisService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class CabinetFacadeService {

	private final CabinetCommandService cabinetCommandService;
	private final CabinetQueryService cabinetQueryService;
	private final LentQueryService lentQueryService;
	private final LentRedisService lentRedisService;
	private final UserQueryService userQueryService;
	private final ClubQueryService clubQueryService;
	private final ClubLentQueryService clubLentQueryService;

	private final CabinetMapper cabinetMapper;
	private final LentMapper lentMapper;

	/**
	 * 존재하는 모든 건물들을 가져오고, 각 건물별 층 정보들을 가져옵니다.
	 *
	 * @return 건물별 층 정보
	 */
	@Transactional(readOnly = true)
	public List<BuildingFloorsDto> getBuildingFloorsResponse() {
		List<String> allBuildings = cabinetQueryService.findAllBuildings();
		return allBuildings.stream()
				.map(building -> cabinetMapper.toBuildingFloorsDto(building,
						cabinetQueryService.findAllFloorsByBuilding(building))
				)
				.collect(Collectors.toList());
	}

	/**
	 * 사물함 id로 사물함 정보를 가져옵니다. active 대여기록이 없는경우, IN_SESSION 상태의 사물함인지 확인합니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @return 사물함 정보
	 */
	@Transactional(readOnly = true)
	public CabinetInfoResponseDto getCabinetInfo(Long cabinetId) {
		Cabinet cabinet = cabinetQueryService.getCabinet(cabinetId);
		if (cabinet.getLentType().equals(LentType.CLUB)) {
			ClubLentHistory activeClubLentHistory =
					clubLentQueryService.findActiveLentHistoryWithClub(cabinetId);
			List<LentDto> lentDtos = new ArrayList<>();
			if (activeClubLentHistory != null) {
				lentDtos.add(lentMapper.toLentDto(activeClubLentHistory));
			}
			LocalDateTime sessionExpiredAt = lentRedisService.getSessionExpired(cabinetId);
			return cabinetMapper.toCabinetInfoResponseDto(cabinet, lentDtos, sessionExpiredAt);
		}
		List<LentHistory> cabinetActiveLentHistories = lentQueryService.findCabinetActiveLentHistories(
				cabinetId);
		List<LentDto> lentDtos = cabinetActiveLentHistories.stream()
				.map(lentHistory -> lentMapper.toLentDto(lentHistory.getUser(), lentHistory))
				.collect(Collectors.toList());

		if (lentDtos.isEmpty()) {
			List<Long> usersInCabinet = lentRedisService.findUsersInCabinet(cabinetId);
			List<User> users = userQueryService.findUsers(usersInCabinet);
			users.forEach(user -> lentDtos.add(
					LentDto.builder().userId(user.getId()).name(user.getName()).build()
			));
		}
		LocalDateTime sessionExpiredAt = lentRedisService.getSessionExpired(cabinetId);

		return cabinetMapper.toCabinetInfoResponseDto(cabinet, lentDtos, sessionExpiredAt);
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
		List<ActiveCabinetInfoEntities> activeCabinetInfos =
				cabinetQueryService.findActiveCabinetInfoEntities(building, floor);
		Map<Cabinet, List<LentHistory>> cabinetLentHistories = activeCabinetInfos.stream().
				collect(groupingBy(ActiveCabinetInfoEntities::getCabinet,
						mapping(ActiveCabinetInfoEntities::getLentHistory, Collectors.toList())));
		List<Cabinet> allCabinetsOnSection =
				cabinetQueryService.findAllCabinetsByBuildingAndFloor(building, floor);
		Map<Long, List<ClubLentHistory>> clubLentMap =
				clubLentQueryService.findAllActiveLentHistoriesWithClub().stream()
						.collect(groupingBy(ClubLentHistory::getCabinetId));

		Map<String, List<CabinetPreviewDto>> cabinetPreviewsBySection = new LinkedHashMap<>();
		allCabinetsOnSection.stream()
				.sorted(Comparator.comparing(Cabinet::getVisibleNum))
				.forEach(cabinet -> {
					String section = cabinet.getCabinetPlace().getLocation().getSection();
					if (cabinet.getLentType().equals(LentType.CLUB)) {
						if (!clubLentMap.containsKey(cabinet.getId())) {
							cabinetPreviewsBySection.computeIfAbsent(section,
											k -> new ArrayList<>())
									.add(cabinetMapper.toCabinetPreviewDto(cabinet, 0, null));
						} else {
							clubLentMap.get(cabinet.getId()).stream()
									.map(c -> c.getClub().getName())
									.findFirst().ifPresent(clubName -> cabinetPreviewsBySection
											.computeIfAbsent(section, k -> new ArrayList<>())
											.add(cabinetMapper.toCabinetPreviewDto(cabinet, 0, clubName)));
						}
						return;
					}
					List<LentHistory> lentHistories =
							cabinetLentHistories.getOrDefault(cabinet, Collections.emptyList());
					String title = getCabinetTitle(cabinet, lentHistories);
					cabinetPreviewsBySection.computeIfAbsent(section, k -> new ArrayList<>())
							.add(cabinetMapper.toCabinetPreviewDto(cabinet, lentHistories.size(),
									title));
				});

		return cabinetPreviewsBySection.entrySet().stream()
				.map(entry -> cabinetMapper.toCabinetsPerSectionResponseDto(entry.getKey(),
						entry.getValue()))
				.collect(Collectors.toList());
	}

	/**
	 * 사물함의 제목을 가져오고, 기존 제목이 없다면 대여한 유저의 이름을 반환합니다
	 *
	 * @param cabinet       제목을 가져올 사물함
	 * @param lentHistories 사물함의 대여기록
	 * @return 사물함 제목
	 */
	private String getCabinetTitle(Cabinet cabinet, List<LentHistory> lentHistories) {
		if (cabinet.getTitle() != null && !cabinet.getTitle().isEmpty()) {
			return cabinet.getTitle();
		} else if (!lentHistories.isEmpty() && lentHistories.get(0).getUser() != null) {
			return lentHistories.get(0).getUser().getName();
		}
		return null;
	}

	/**
	 * 빌딩에 있는 모든 PENDING 상태의 사물함을 가져옵니다.
	 *
	 * @param building 건물 이름
	 * @return 빌딩에 있는 모든 PENDING 상태의 사물함
	 */
	@Transactional
	public CabinetPendingResponseDto getAvailableCabinets(String building) {
		final LocalDateTime now = LocalDateTime.now();
		List<Cabinet> pendingCabinets =
				cabinetQueryService.findPendingCabinetsNotLentTypeAndStatus(
						building, LentType.CLUB, List.of(AVAILABLE, PENDING));
		List<Long> cabinetIds = pendingCabinets.stream()
				.filter(cabinet -> cabinet.isStatus(PENDING))
				.map(Cabinet::getId).collect(Collectors.toList());
		Map<Long, List<LentHistory>> lentHistoriesMap;
		if (now.getHour() < 13) {
			lentHistoriesMap = lentQueryService.findPendingLentHistoriesOnDate(
							now.minusDays(1).toLocalDate(), cabinetIds)
					.stream().collect(groupingBy(LentHistory::getCabinetId));
		} else {
			lentHistoriesMap = lentQueryService.findCabinetLentHistories(cabinetIds)
					.stream().collect(groupingBy(LentHistory::getCabinetId));
		}
		Map<Integer, List<CabinetPreviewDto>> cabinetFloorMap =
				cabinetQueryService.findAllFloorsByBuilding(building).stream()
						.collect(toMap(key -> key, value -> new ArrayList<>()));
		availableCabinets.forEach(cabinet -> {
			Integer floor = cabinet.getCabinetPlace().getLocation().getFloor();
			if (cabinet.isStatus(AVAILABLE)) {
				cabinetFloorMap.get(floor).add(cabinetMapper.toCabinetPreviewDto(cabinet, 0, null));
			}
			if (cabinet.isStatus(PENDING)) {
				List<LentHistory> lentHistories = lentHistoriesMap.get(cabinet.getId());
				if (lentHistories == null || lentHistories.isEmpty()) {
					return;
				}
				lentHistories.stream()
						.map(LentHistory::getEndedAt)
						.max(LocalDateTime::compareTo)
						.ifPresent(latestEndedAt -> cabinetFloorMap.get(floor)
								.add(cabinetMapper.toCabinetPreviewDto(cabinet, 0, null)));
			}
		});
		return cabinetMapper.toCabinetPendingResponseDto(cabinetFloorMap);
	}

	/**
	 * CabinetStatus에 해당하는 캐비넷 정보를 모두 가져옵니다.
	 *
	 * @param status   캐비넷 상태
	 * @param pageable 페이징 정보
	 * @return 캐비넷 정보
	 */
	public CabinetPaginationDto getCabinetPaginationByStatus(CabinetStatus status,
			Pageable pageable) {
		Page<Cabinet> cabinets = cabinetQueryService.findAllByStatus(status, pageable);
		List<CabinetDto> result = cabinets.stream()
				.map(cabinetMapper::toCabinetDto).collect(Collectors.toList());
		return cabinetMapper.toCabinetPaginationDtoList(result, cabinets.getTotalElements());
	}

	/**
	 * cabinetId로 해당 사물함의 대여기록을 모두 가져옵니다. ( 대여시작 날짜 내림차순 정렬)
	 *
	 * @param cabinetId 대여기록을 가져올 사물함 ID
	 * @param pageable  페이징 정보
	 * @return 대여기록
	 */
	@Transactional(readOnly = true)
	public LentHistoryPaginationDto getLentHistoryPagination(Long cabinetId, Pageable pageable) {
		Page<LentHistory> lentHistories = lentQueryService.findCabinetLentHistoriesWithUserAndCabinet(
				cabinetId, pageable);
		List<LentHistoryDto> result = lentHistories.stream()
				.sorted(Comparator.comparing(LentHistory::getStartedAt).reversed())
				.map(lh -> lentMapper.toLentHistoryDto(lh, lh.getUser(), lh.getCabinet()))
				.collect(Collectors.toList());
		return lentMapper.toLentHistoryPaginationDto(result, lentHistories.getTotalElements());
	}

	/*--------------------------------------------CUD--------------------------------------------*/

	/**
	 * [ADMIN] 사물함의 상태 노트 변경
	 *
	 * @param cabinetId  변경할 cabinet ID
	 * @param statusNote 변경할 상태 메모
	 */
	@Transactional
	public void updateCabinetStatusNote(Long cabinetId, String statusNote) {
		Cabinet cabinet = cabinetQueryService.getCabinet(cabinetId);
		cabinetCommandService.changeCabinetStatusNote(cabinet, statusNote);
	}


	/**
	 * 사물함의 제목을 변경합니다
	 *
	 * @param cabinetId 변경할 사물함 ID
	 * @param title     변경할 사물함 제목
	 */
	@Transactional
	public void updateCabinetTitle(Long cabinetId, String title) {
		Cabinet cabinet = cabinetQueryService.getCabinet(cabinetId);
		cabinetCommandService.updateTitle(cabinet, title);
	}

	/**
	 * [ADMIN] 사물함의 위치정보를 변경합니다.
	 *
	 * @param cabinetId 변경할 사물함 ID
	 * @param row       변경할 row
	 * @param col       변경할 col
	 */
	@Transactional
	public void updateCabinetGrid(Long cabinetId, Integer row, Integer col) {
		Cabinet cabinet = cabinetQueryService.getCabinet(cabinetId);
		cabinetCommandService.updateGrid(cabinet, Grid.of(row, col));
	}

	/**
	 * [ADMIN] 사물함의 번호를 변경합니다.
	 *
	 * @param cabinetId  변경할 사물함 ID
	 * @param visibleNum 변경할 visibleNum
	 */
	@Transactional
	public void updateCabinetVisibleNum(Long cabinetId, Integer visibleNum) {
		Cabinet cabinet = cabinetQueryService.getCabinet(cabinetId);
		cabinetCommandService.updateVisibleNum(cabinet, visibleNum);
	}

	/**
	 * [ADMIN] 사물함의 상태를 변경합니다.
	 *
	 * @param cabinetIds 변경할 사물함 ID 리스트
	 * @param status     변경할 상태
	 * @param lentType   변경할 대여 타입
	 */
	@Transactional
	public void updateCabinetBundleStatus(List<Long> cabinetIds, CabinetStatus status,
			LentType lentType) {

		List<Cabinet> cabinetsWithLock = cabinetQueryService.findCabinetsForUpdate(cabinetIds);

		for (Cabinet cabinet : cabinetsWithLock) {
			if (status != null) {
				cabinetCommandService.updateStatus(cabinet, status);
			}
			if (lentType != null) {
				cabinetCommandService.updateLentType(cabinet, lentType);
			}
		}
	}

	/**
	 * [ADMIN] 사물함에 동아리 유저를 대여 시킵니다. {inheritDoc}
	 *
	 * @param clubId     대여할 유저 ID
	 * @param cabinetId  대여할 사물함 ID
	 * @param statusNote 상태 메모
	 */
	@Transactional
	public void updateClub(Long clubId, Long cabinetId, String statusNote) {
		Cabinet cabinet = cabinetQueryService.getUserActiveCabinetForUpdate(cabinetId);
		Club club = clubQueryService.getClub(clubId);
	}

	/**
	 * [ADMIN] 사물함id 로 사물함을 찾아서, 상태를 변경시킵니다
	 *
	 * @param cabinetId 사물함 ID
	 * @param status    변경할 상태
	 */
	@Transactional
	public void updateStatus(Long cabinetId, CabinetStatus status) {
		if (!status.isValid()) {
			throw ExceptionStatus.INVALID_STATUS.asServiceException();
		}
		Cabinet cabinet = cabinetQueryService.getCabinetForUpdate(cabinetId);
		cabinet.specifyStatus(status);
	}

	@Transactional
	public void updateStatus(List<Long> cabinetId, CabinetStatus status) {
		cabinetCommandService.updateStatusBulk(cabinetId, status);
	}
}
