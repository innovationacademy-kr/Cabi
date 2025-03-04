package org.ftclub.cabinet.admin.statistics.controller;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.statistics.service.AdminStatisticsFacadeService;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.CabinetFloorStatisticsResponseDto;
import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v4/admin/statistics")
@RequiredArgsConstructor
@Logging
public class AdminStatisticsController {

	private final AdminStatisticsFacadeService adminStatisticsFacadeService;

	/**
	 * 전 층의 사물함 정보를 가져옵니다.
	 *
	 * @return 전 층의 사물함 정보를 반환합니다.
	 */
	@GetMapping("/buildings/floors/cabinets")
	public List<CabinetFloorStatisticsResponseDto> getAllCabinetsInfo() {
		return adminStatisticsFacadeService.getAllCabinetsInfo();
	}

	/**
	 * 현재일자 기준, 입력한 기간 동안 발생한 대여 및 반납의 횟수를 가져옵니다.
	 *
	 * @param startDate 입력할 기간의 시작일
	 * @param endDate   입력할 기간의 종료일
	 * @return 현재일자 기준, 입력한 기간 동안 발생한 대여 및 반납의 횟수를 반환합니다.
	 */
	@GetMapping("/lent-histories")
	public LentsStatisticsResponseDto getLentCountStatistics(
			@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
			@RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
		return adminStatisticsFacadeService.getLentCountStatistics(startDate, endDate);
	}

	/**
	 * 차단당한 유저 정보를 가져옵니다.
	 *
	 * @param pageable 페이지 정보
	 * @return 차단당한 유저 정보를 반환합니다.
	 */
	@GetMapping("/users/banned")
	public BlockedUserPaginationDto getUsersBannedInfo(Pageable pageable) {
		return adminStatisticsFacadeService.getAllBanUsers(pageable);
	}

	/**
	 * 연체중인 유저 리스트를 가져옵니다.
	 *
	 * @param pageable 페이지 정보
	 * @return 연체중인 유저 리스트를 반환합니다.
	 */
	@GetMapping("/users/overdue")
	public OverdueUserCabinetPaginationDto getOverdueUsers(Pageable pageable) {
		return adminStatisticsFacadeService.getOverdueUsers(pageable);
	}

}
