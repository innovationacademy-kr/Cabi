package org.ftclub.cabinet.statistics.controller;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.CabinetFloorStatisticsResponseDto;
import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.ftclub.cabinet.statistics.service.StatisticsFacadeService;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/statistics")
@Log4j2
public class StatisticsController {

	private final StatisticsFacadeService statisticsFacadeService;
	private final UserFacadeService userFacadeService;

	/**
	 * 전 층의 사물함 정보를 가져옵니다.
	 *
	 * @return 전 층의 사물함 정보를 반환합니다.
	 */
	@GetMapping("/buildings/floors/cabinets")
	@AuthGuard(level = ADMIN_ONLY)
	public List<CabinetFloorStatisticsResponseDto> getCabinetsInfoOnAllFloors() {
		log.info("Called getCabinetsInfoOnAllFloors");
		return statisticsFacadeService.getCabinetsCountOnAllFloors();
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
	public LentsStatisticsResponseDto getCountOnLentAndReturn(
			@RequestParam("startDate") Integer startDate,
			@RequestParam("endDate") Integer endDate
	) {
		log.info("Called getCountOnLentAndReturn");
		return statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate);
	}

	/**
	 * 차단당한 유저 정보를 가져옵니다.
	 *
	 * @param page 가져오고자 하는 페이지
	 * @param size 가져오고자 하는 페이지의 길이
	 * @return 차단당한 유저 정보를 반환합니다.
	 */
	@GetMapping("/users/banned")
	@AuthGuard(level = ADMIN_ONLY)
	public BlockedUserPaginationDto getUsersBannedInfo(
			@RequestParam("page") Integer page,
			@RequestParam("size") Integer size
	) {
		log.info("Called getUsersBannedInfo");
		return userFacadeService.getAllBanUsers(page, size, DateUtil.getNow());
	}

	/**
	 * 연체중인 유저 리스트를 가져옵니다.
	 *
	 * @param page 가져오고자 하는 페이지
	 * @param size 가져오고자 하는 페이지의 길이
	 * @return 연체중인 유저 리스트를 반환합니다.
	 */
	@GetMapping("/users/overdue")
	@AuthGuard(level = ADMIN_ONLY)
	public OverdueUserCabinetPaginationDto getOverdueUsers(
			@RequestParam("page") Integer page,
			@RequestParam("size") Integer size
	) {
		log.info("Called getOverdueUsers");
		return userFacadeService.getOverdueUserList(page, size);
	}
}
