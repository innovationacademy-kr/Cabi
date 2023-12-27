package org.ftclub.cabinet.admin.search.controller;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.search.service.AdminSearchFacadeService;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.dto.CabinetInfoPaginationDto;
import org.ftclub.cabinet.dto.CabinetSimplePaginationDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v4/admin/search")
@RequiredArgsConstructor
@Logging
public class AdminSearchController {

	private final AdminSearchFacadeService adminSearchFacadeService;

	@GetMapping("/cabinets-simple")
	@AuthGuard(level = ADMIN_ONLY)
	public CabinetSimplePaginationDto getCabinetsSimpleInfo(
			@RequestParam("visibleNum") Integer visibleNum) {
		return adminSearchFacadeService.getCabinetsSimpleInfo(visibleNum);
	}

	@GetMapping("/cabinets")
	@AuthGuard(level = ADMIN_ONLY)
	public CabinetInfoPaginationDto getCabinetsInfo(
			@RequestParam("visibleNum") Integer visibleNum) {
		return adminSearchFacadeService.getCabinetInfo(visibleNum);
	}

	@GetMapping("/users-simple")
	@AuthGuard(level = ADMIN_ONLY)
	public UserProfilePaginationDto getUsersProfile(
			@RequestParam("name") String name, Pageable pageable) {
		return adminSearchFacadeService.getUsersProfile(name, pageable);
	}

	@GetMapping("/users")
	@AuthGuard(level = ADMIN_ONLY)
	public UserCabinetPaginationDto getCabinetsLentInfo(
			@RequestParam("name") String name, Pageable pageable) {
		return adminSearchFacadeService.getUserLentCabinetInfo(name, pageable);
	}
}
