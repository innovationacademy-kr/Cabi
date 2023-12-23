package org.ftclub.cabinet.admin.search;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

@Slf4j
@RestController
@RequestMapping("/v4/admin/search")
@RequiredArgsConstructor
public class AdminSearchController {
	private final AdminSearchFacadeService adminSearchFacadeService;

	@GetMapping("/cabinets-simple")
	@AuthGuard(level = ADMIN_ONLY)
	public CabinetSimplePaginationDto getCabinetsSimpleInfo(
			@RequestParam("visibleNum") Integer visibleNum) {
		log.info("Called getCabinetsSimpleInfo {}", visibleNum);
		return adminSearchFacadeService.getCabinetsSimpleInfo(visibleNum);
	}

	@GetMapping("/cabinets")
	@AuthGuard(level = ADMIN_ONLY)
	public CabinetInfoPaginationDto getCabinetsInfo(
			@RequestParam("visibleNum") Integer visibleNum) {
		log.info("Called getCabinetsInfo {}", visibleNum);
		return adminSearchFacadeService.getCabinetInfo(visibleNum);
	}

	@GetMapping("/users-simple")
	@AuthGuard(level = ADMIN_ONLY)
	public UserProfilePaginationDto getUsersProfile(
			@RequestParam("name") String name, Pageable pageable) {
		log.info("Called getUsersProfile {}", name);
		return adminSearchFacadeService.getUsersProfile(name, pageable);
	}

	@GetMapping("/users")
	@AuthGuard(level = ADMIN_ONLY)
	public UserCabinetPaginationDto getCabinetsLentInfo(
			@RequestParam("name") String name, Pageable pageable) {
		log.info("Called getCabinetsLentInfo {}", name);
		return adminSearchFacadeService.getUserLentCabinetInfo(name, pageable);
	}
}
