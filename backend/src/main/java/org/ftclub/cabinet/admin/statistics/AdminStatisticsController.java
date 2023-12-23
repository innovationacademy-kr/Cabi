package org.ftclub.cabinet.admin.statistics;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.CabinetFloorStatisticsResponseDto;
import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

@Slf4j
@RestController
@RequestMapping("/v4/admin/statistics")
@RequiredArgsConstructor
public class AdminStatisticsController {
	private final AdminStatisticsFacadeService adminStatisticsFacadeService;

	/**
	 * 전 층의 사물함 정보를 가져옵니다.
	 *
	 * @return 전 층의 사물함 정보를 반환합니다.
	 */
	@GetMapping("/buildings/floors/cabinets")
	@AuthGuard(level = ADMIN_ONLY)
	public List<CabinetFloorStatisticsResponseDto> getAllCabinetsInfo() {
		log.info("Called getAllCabinetsInfo");
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
	@AuthGuard(level = ADMIN_ONLY)
	public LentsStatisticsResponseDto getLentCountStatistics(
			@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
			@RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
		log.info("Called getCountOnLentAndReturn startDate : {} endDate : {}", startDate, endDate);
		return adminStatisticsFacadeService.getLentCountStatistics(startDate, endDate);
	}

	/**
	 * 차단당한 유저 정보를 가져옵니다.
	 *
	 * @param pageable 페이지 정보
	 * @return 차단당한 유저 정보를 반환합니다.
	 */
	@GetMapping("/users/banned")
	@AuthGuard(level = ADMIN_ONLY)
	public BlockedUserPaginationDto getUsersBannedInfo(Pageable pageable) {
		log.info("Called getUsersBannedInfo");
		return adminStatisticsFacadeService.getAllBanUsers(pageable);
	}

	/**
	 * 연체중인 유저 리스트를 가져옵니다.
	 *
	 * @param pageable 페이지 정보
	 * @return 연체중인 유저 리스트를 반환합니다.
	 */
	@GetMapping("/users/overdue")
	@AuthGuard(level = ADMIN_ONLY)
	public OverdueUserCabinetPaginationDto getOverdueUsers(Pageable pageable) {
		log.info("Called getOverdueUsers");
		return adminStatisticsFacadeService.getOverdueUsers(pageable);
	}

}
