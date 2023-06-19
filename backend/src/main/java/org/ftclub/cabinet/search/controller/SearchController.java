package org.ftclub.cabinet.search.controller;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.dto.CabinetInfoPaginationDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.statistics.controller.StatisticsController;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/search")
public class SearchController {
	private static final Logger logger = LogManager.getLogger(SearchController.class);
	private final CabinetFacadeService cabinetFacadeService;
	private final UserFacadeService userFacadeService;

	@GetMapping("/cabinets")
	@AuthGuard(level = ADMIN_ONLY)
	public CabinetInfoPaginationDto getCabinetsInfo(
			@RequestParam("visibleNum") Integer visibleNum
	) {
		logger.info("Called getCabinetsInfo");
		return cabinetFacadeService.getCabinetsInfo(visibleNum);
	}

	@GetMapping("/users-simple")
	@AuthGuard(level = ADMIN_ONLY)
	public UserProfilePaginationDto getUsersProfile(
			@RequestParam("name") String name,
			@RequestParam("page") Integer page,
			@RequestParam("size") Integer size
	) {
		logger.info("Called getUsersProfile");
		return userFacadeService.getUserProfileListByPartialName(name, page, size);
	}

	@GetMapping("/users")
	@AuthGuard(level = ADMIN_ONLY)
	public UserCabinetPaginationDto getCabinetsLentInfo(
			@RequestParam("name") String name,
			@RequestParam("page") Integer page,
			@RequestParam("size") Integer size
	) {
		logger.info("Called getCabinetsLentInfo");
		return userFacadeService.findUserCabinetListByPartialName(name, page, size);
	}


}
