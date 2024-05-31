package org.ftclub.cabinet.admin.statistics.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.statistics.service.AdminStatisticsFacadeService;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.CoinCollectStatisticsDto;
import org.ftclub.cabinet.log.Logging;
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

}
