package org.ftclub.cabinet.admin.controller;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.newService.AdminFacadeService;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.dto.CabinetInfoPaginationDto;
import org.ftclub.cabinet.dto.CabinetSimplePaginationDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/v4/admin")
@RequiredArgsConstructor
public class AdminController {

	private final AdminFacadeService adminFacadeService;


	@GetMapping("/search/cabinets-simple")
	@AuthGuard(level = ADMIN_ONLY)
	public CabinetSimplePaginationDto getCabinetsSimpleInfo(
			@RequestParam("visibleNum") Integer visibleNum) {
		log.info("Called getCabinetsInfo {}", visibleNum);
		return adminFacadeService.getCabinetsSimpleInfo(visibleNum);
	}

	@GetMapping("/search/cabinets")
	@AuthGuard(level = ADMIN_ONLY)
	public CabinetInfoPaginationDto getCabinetsInfo(
			@RequestParam("visibleNum") Integer visibleNum) {
		log.info("Called getCabinetsInfo {}", visibleNum);
		return adminFacadeService.getCabinetInfo(visibleNum);
	}

	@GetMapping("/search/users-simple")
	@AuthGuard(level = ADMIN_ONLY)
	public UserProfilePaginationDto getUsersProfile(
			@RequestParam("name") String name, Pageable pageable) {
		log.info("Called getUsersProfile {}", name);
		return adminFacadeService.getUsersProfile(name, pageable);
	}

	@GetMapping("/search/users")
	@AuthGuard(level = ADMIN_ONLY)
	public UserCabinetPaginationDto getCabinetsLentInfo(
			@RequestParam("name") String name, Pageable pageable) {
		log.info("Called getCabinetsLentInfo {}", name);
		return adminFacadeService.getUserLentCabinetInfo(name, pageable);
	}
}
