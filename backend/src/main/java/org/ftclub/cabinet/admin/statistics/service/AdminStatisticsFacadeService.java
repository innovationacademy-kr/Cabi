package org.ftclub.cabinet.admin.statistics.service;

import static java.util.stream.Collectors.groupingBy;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.AVAILABLE;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.BROKEN;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.FULL;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.OVERDUE;
import static org.ftclub.cabinet.item.domain.Sku.COIN_COLLECT;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.CabinetFloorStatisticsResponseDto;
import org.ftclub.cabinet.dto.CoinAmountDto;
import org.ftclub.cabinet.dto.CoinCollectStatisticsDto;
import org.ftclub.cabinet.dto.CoinCollectedCountDto;
import org.ftclub.cabinet.dto.CoinStaticsDto;
import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.ftclub.cabinet.dto.TotalCoinAmountDto;
import org.ftclub.cabinet.dto.UserBlockedInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.service.ItemHistoryQueryService;
import org.ftclub.cabinet.item.service.ItemQueryService;
import org.ftclub.cabinet.item.service.ItemRedisService;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.ItemMapper;
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
	private final ItemHistoryQueryService itemHistoryQueryService;
	private final ItemQueryService itemQueryService;
	private final ItemMapper itemMapper;
	private final ItemRedisService itemRedisService;

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

	/**
	 * 특정 연도, 월의 동전 줍기 횟수를 횟수 별로 통계를 내서 반환
	 *
	 * @param year
	 * @param month 조회를 원하는 기간
	 * @return
	 */
	public CoinCollectStatisticsDto getCoinCollectCountByMonth(Integer year, Integer month) {
		Long itemId = itemQueryService.getBySku(COIN_COLLECT).getId();
		List<ItemHistory> coinCollectedInfoByMonth =
				itemHistoryQueryService.findCoinCollectedInfoByMonth(itemId, year, month);
		Map<Long, Long> coinCollectCountByUser = coinCollectedInfoByMonth.stream()
				.collect(groupingBy(ItemHistory::getUserId, Collectors.counting()));

		int[] coinCollectArray = new int[31];
		coinCollectCountByUser.forEach((userId, coinCount) ->
				coinCollectArray[coinCount.intValue() - 1]++);

		List<CoinCollectedCountDto> coinCollectedCountDto = IntStream.rangeClosed(0,
						30) // 1부터 30까지의 범위로 스트림 생성
				.mapToObj(i -> new CoinCollectedCountDto(i + 1,
						coinCollectArray[i])) // 각 인덱스와 해당하는 배열 값으로 CoinCollectedCountDto 생성
				.collect(Collectors.toList()); // 리스트로 변환하여 반환

		return new CoinCollectStatisticsDto(coinCollectedCountDto);
	}

	/**
	 * 전체 기간동안 동전의 발행량 및 사용량 반환
	 *
	 * @return
	 */
	public TotalCoinAmountDto getTotalCoinAmount() {
		long totalCoinSupply = itemRedisService.getTotalCoinSupply();
		long totalCoinUsage = itemRedisService.getTotalCoinUsage();

		// 재화 총 사용량, 현재 총 보유량 (총 공급량 - 총 사용량) 반환
		return new TotalCoinAmountDto(totalCoinUsage, totalCoinSupply + totalCoinUsage);
	}

	/**
	 * 특정 기간동안 재화 사용량 및 발행량 조회
	 *
	 * @param startDate
	 * @param endDate   조회를 원하는 기간
	 * @return
	 */
	public CoinStaticsDto getCoinStaticsDto(LocalDate startDate, LocalDate endDate) {
		Map<LocalDate, Long> issuedAmount = new LinkedHashMap<>();
		Map<LocalDate, Long> usedAmount = new LinkedHashMap<>();
		long dayDifference = ChronoUnit.DAYS.between(startDate, endDate) + 1;
		IntStream.range(0, (int) dayDifference)
				.mapToObj(startDate::plusDays)
				.forEach(date -> {
					issuedAmount.put(date, 0L);
					usedAmount.put(date, 0L);
				});

		List<ItemHistory> usedCoins =
				itemHistoryQueryService.findUsedCoinHistoryBetween(startDate,
						endDate);

		usedCoins.forEach(
				ih -> {
					Long price = ih.getItem().getPrice();
					LocalDate date = ih.getUsedAt().toLocalDate();

					if (price > 0) {
						issuedAmount.put(date, issuedAmount.get(date) + price);
					} else {
						usedAmount.put(date, usedAmount.get(date) + price);
					}
				});
		List<CoinAmountDto> issueCoin = convertMapToList(issuedAmount);
		List<CoinAmountDto> usedCoin = convertMapToList(usedAmount);

		return new CoinStaticsDto(issueCoin, usedCoin);
	}

	List<CoinAmountDto> convertMapToList(Map<LocalDate, Long> map) {
		return map.entrySet().stream()
				.map(entry -> itemMapper.toCoinAmountDto(entry.getKey(), entry.getValue()))
				.sorted(Comparator.comparing(CoinAmountDto::getDate))
				.collect(Collectors.toList());
	}
}
