package org.ftclub.cabinet.admin.statistics.service;

import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.AVAILABLE;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.BROKEN;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.FULL;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.OVERDUE;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.CabinetFloorStatisticsResponseDto;
import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserBlockedInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.service.BanHistoryQueryService;
import org.ftclub.cabinet.utils.DateUtil;
import org.ftclub.cabinet.utils.ExceptionUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 관리자 페이지에서 사용되는 통계 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Logging(level = LogLevel.DEBUG)
public class AdminStatisticsFacadeService {

	private final CabinetQueryService cabinetQueryService;
	private final LentQueryService lentQueryService;
	private final BanHistoryQueryService banHistoryQueryService;

	private final CabinetMapper cabinetMapper;
	private final UserMapper userMapper;

	/**
	 * 현재 가용중인 모든 사물함의 현황을 반환합니다.
	 *
	 * @return 캐비넷 정보 리스트
	 */
	public List<CabinetFloorStatisticsResponseDto> getAllCabinetsInfo() {
		List<String> buildings = cabinetQueryService.findAllBuildings();
		List<Integer> floors = cabinetQueryService.findAllFloorsByBuildings(buildings);
		return floors.stream().map(floor -> {
			Integer used = cabinetQueryService.countCabinets(FULL, floor);
			Integer unused = cabinetQueryService.countCabinets(AVAILABLE, floor);
			Integer overdue = cabinetQueryService.countCabinets(OVERDUE, floor);
			Integer disabled = cabinetQueryService.countCabinets(BROKEN, floor);
			Integer total = used + overdue + unused + disabled;
			return cabinetMapper.toCabinetFloorStatisticsResponseDto(
					floor, total, used, overdue, unused, disabled);
		}).collect(Collectors.toList());
	}

	/**
	 * startDate부터 endDate 까지의 대여/반납 현황을 반환합니다.
	 *
	 * @return 대여/반납 현황
	 */
	public LentsStatisticsResponseDto getLentCountStatistics(
			LocalDateTime startDate, LocalDateTime endDate) {
		ExceptionUtil.throwIfFalse(startDate.isBefore(endDate),
				new ServiceException(ExceptionStatus.INVALID_ARGUMENT));
		int lentStartCount = lentQueryService.countLentOnDuration(startDate, endDate);
		int lentEndCount = lentQueryService.countReturnOnDuration(startDate, endDate);
		return cabinetMapper.toLentsStatisticsResponseDto(
				startDate, endDate, lentStartCount, lentEndCount);
	}

	/**
	 * 현재 밴 상태인 유저들의 정보를 반환합니다.
	 *
	 * @param pageable 페이징 정보
	 * @return 밴 상태인 유저들의 정보
	 */
	public BlockedUserPaginationDto getAllBanUsers(Pageable pageable) {
		LocalDateTime now = LocalDateTime.now();
		Page<BanHistory> banHistories =
				banHistoryQueryService.findActiveBanHistories(now, pageable);
		List<UserBlockedInfoDto> result = banHistories.stream()
				.map(b -> userMapper.toUserBlockedInfoDto(b, b.getUser()))
				.collect(Collectors.toList());
		return userMapper.toBlockedUserPaginationDto(result, banHistories.getTotalElements());
	}

	/**
	 * 현재 연체중인 유저들의 정보를 반환합니다.
	 *
	 * @param pageable 페이징 정보
	 * @return 연체중인 유저들의 정보
	 */
	public OverdueUserCabinetPaginationDto getOverdueUsers(Pageable pageable) {
		LocalDateTime now = LocalDateTime.now();
		List<LentHistory> lentHistories = lentQueryService.findOverdueLentHistories(now, pageable);
		List<OverdueUserCabinetDto> result = lentHistories.stream()
				.map(lh -> cabinetMapper.toOverdueUserCabinetDto(lh, lh.getUser(), lh.getCabinet(),
						DateUtil.calculateTwoDateDiff(now, lh.getExpiredAt()))
				).collect(Collectors.toList());
		return cabinetMapper.toOverdueUserCabinetPaginationDto(result, (long) lentHistories.size());
	}
}
