package org.ftclub.cabinet.search.controller;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.dto.CabinetInfoPaginationDto;
import org.ftclub.cabinet.dto.CabinetSimplePaginationDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/search")
@Log4j2
public class SearchController {

	private final CabinetFacadeService cabinetFacadeService;
	private final UserFacadeService userFacadeService;

	@GetMapping("/cabinets")
	@AuthGuard(level = ADMIN_ONLY)
	public CabinetInfoPaginationDto getCabinetsInfo(
			@RequestParam("visibleNum") Integer visibleNum
	) {
		log.info("Called getCabinetsInfo {}", visibleNum);
		return cabinetFacadeService.getCabinetsInfo(visibleNum);
	}

	@GetMapping("/cabinets-simple")
	@AuthGuard(level = ADMIN_ONLY)
	public CabinetSimplePaginationDto getCabinetsSimpleInfo(
			@RequestParam("visibleNum") Integer visibleNum
	) {
		log.info("Called getCabinetsInfo {}", visibleNum);
		return cabinetFacadeService.getCabinetsSimpleInfoByVisibleNum(visibleNum);
	}

	@GetMapping("/users-simple")
	@AuthGuard(level = ADMIN_ONLY)
	public UserProfilePaginationDto getUsersProfile(
			@RequestParam("name") String name,
			@RequestParam("page") Integer page,
			@RequestParam("size") Integer size
	) {
		log.info("Called getUsersProfile {}", name);
		return userFacadeService.getUserProfileListByPartialName(name, page, size);
	}

	@GetMapping("/users")
	@AuthGuard(level = ADMIN_ONLY)
	public UserCabinetPaginationDto getCabinetsLentInfo(
			@RequestParam("name") String name,
			@RequestParam("page") Integer page,
			@RequestParam("size") Integer size
	) {
		log.info("Called getCabinetsLentInfo {}", name);
		return userFacadeService.findUserCabinetListByPartialName(name, page, size);
	}


}
