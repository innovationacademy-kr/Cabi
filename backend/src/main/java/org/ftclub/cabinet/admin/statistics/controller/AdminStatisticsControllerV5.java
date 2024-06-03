package org.ftclub.cabinet.admin.statistics.controller;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.item.service.AdminItemFacadeService;
import org.ftclub.cabinet.admin.statistics.service.AdminStatisticsFacadeService;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.CoinCollectStatisticsDto;
import org.ftclub.cabinet.dto.CoinStaticsDto;
import org.ftclub.cabinet.dto.ItemStatisticsDto;
import org.ftclub.cabinet.dto.TotalCoinAmountDto;
import org.ftclub.cabinet.log.Logging;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v5/admin/statistics")
@RequiredArgsConstructor
@Logging
public class AdminStatisticsControllerV5 {

	private final AdminStatisticsFacadeService adminStatisticsFacadeService;
	private final AdminItemFacadeService adminItemFacadeService;

	/**
	 * 특정 연도, 월의 동전 줍기 횟수를 횟수 별로 통계를 내서 반환
	 *
	 * @param year
	 * @param month 조회를 원하는 기간
	 * @return
	 */
	@GetMapping("/coins/collect")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public CoinCollectStatisticsDto getCoinCollectCountByMonth(
			@RequestParam("year") Integer year,
			@RequestParam("month") Integer month) {
		return adminStatisticsFacadeService.getCoinCollectCountByMonth(year, month);
	}

	/**
	 * 전체 기간동안 동전의 발행량 및 사용량 반환
	 *
	 * @return
	 */
	@GetMapping("/coins")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public TotalCoinAmountDto getTotalCoinAmount() {
		return adminStatisticsFacadeService.getTotalCoinAmount();
	}

	/**
	 * 아이템별 구매 인원 조회
	 *
	 * @return
	 */
	@GetMapping("/items")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public ItemStatisticsDto getItemPurchaseStatistics() {
		return adminItemFacadeService.getItemPurchaseStatistics();
	}

	/**
	 * 특정 기간동안 재화 사용량 및 발행량 조회
	 *
	 * @param startDate
	 * @param endDate   조회를 원하는 기간
	 * @return
	 */
	@GetMapping("/coins/use")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public CoinStaticsDto getCoinStaticsDto(
			@RequestParam("startDate") @DateTimeFormat(iso = ISO.DATE_TIME) LocalDateTime startDate,
			@RequestParam("endDate") @DateTimeFormat(iso = ISO.DATE_TIME) LocalDateTime endDate) {
		return adminStatisticsFacadeService.getCoinStaticsDto(startDate.toLocalDate(),
				endDate.toLocalDate());

	}

}
