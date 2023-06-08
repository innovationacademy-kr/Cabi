package org.ftclub.cabinet.statistics.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.CabinetFloorStatisticsResponseDto;
import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.ftclub.cabinet.statistics.service.StatisticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/statistics")
public class StatisticsController {

	private final StatisticsService statisticsService;
	/**
	 * 전 층의 사물함 정보를 가져옵니다.
	 * @return 전 층의 사물함 정보를 반환합니다.
	 */
	@GetMapping("/buildings/floors/cabinets")
	public List<CabinetFloorStatisticsResponseDto> getCabinetsInfoOnAllFloors() {
		return statisticsService.getCabinetsCountOnAllFloors();
	}

	/**
	 * 현재일자 기준, 입력한 기간 동안 발생한 대여 및 반납의 횟수를 가져옵니다.
	 * @param startDate 입력할 기간의 시작일
	 * @param endDate 입력할 기간의 종료일
	 * @return 현재일자 기준, 입력한 기간 동안 발생한 대여 및 반납의 횟수를 반환합니다.
	 */
	@GetMapping("/lent-histories")
	public LentsStatisticsResponseDto getCountOnLentAndReturn(
			@RequestParam("startDate") Date startDate,
			@RequestParam("endDate") Date endDate
	) {
		return statisticsService.getCountOnLentAndReturn(startDate, endDate);
	}

	/**
	 * 차단당한 유저 정보를 가져옵니다.
	 * @param page 가져오고자 하는 페이지
	 * @param length 가져오고자 하는 페이지의 길이
	 * @return 차단당한 유저 정보를 반환합니다.
	 */
	@GetMapping("/users/banned")
	public BlockedUserPaginationDto getUsersBannedInfo(
			@RequestParam("page") Integer page,
			@RequestParam("length") Integer length
	) {
		return statisticsService.getUsersBannedInfo(page, length);
	}

	/**
	 * 연체중인 유저 리스트를 가져옵니다.
	 * @param page 가져오고자 하는 페이지
	 * @param length 가져오고자 하는 페이지의 길이
	 * @return 연체중인 유저 리스트를 반환합니다.
	 */
	@GetMapping("/users/overdue")
	public OverdueUserCabinetPaginationDto getOverdueUsers(
			@RequestParam("page") Integer page,
			@RequestParam("length") Integer length
	) {
		return statisticsService.getOverdueUsers(page, length);
	}
}
