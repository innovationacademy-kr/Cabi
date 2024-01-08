package org.ftclub.cabinet.admin.search.controller;

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

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

/**
 * Admin 페이지에서 검색을 할 때 사용하는 컨트롤러입니다.
 */
@RestController
@RequestMapping("/v4/admin/search")
@RequiredArgsConstructor
@Logging
public class AdminSearchController {

	private final AdminSearchFacadeService adminSearchFacadeService;

	/**
	 * 사물함의 간단한 정보를 가져옵니다. - id, 위치, 실물번호
	 *
	 * @param visibleNum 가져올 사물함의 실물 번호
	 * @return 사물함의 정보를 반환합니다.
	 */
	@GetMapping("/cabinets-simple")
	@AuthGuard(level = ADMIN_ONLY)
	public CabinetSimplePaginationDto getCabinetsSimpleInfo(
			@RequestParam("visibleNum") Integer visibleNum) {
		return adminSearchFacadeService.getCabinetsSimpleInfo(visibleNum);
	}

	/**
	 * 사물함의 정보를 가져옵니다.
	 *
	 * @param visibleNum 가져올 사물함의 실물 번호
	 * @return 사물함의 정보를 반환합니다.
	 */
	@GetMapping("/cabinets")
	@AuthGuard(level = ADMIN_ONLY)
	public CabinetInfoPaginationDto getCabinetsInfo(
			@RequestParam("visibleNum") Integer visibleNum) {
		return adminSearchFacadeService.getCabinetInfo(visibleNum);
	}

	/**
	 * 유저의 프로필을 가져옵니다.
	 *
	 * @param name     검색하려는 partial 이름
	 * @param pageable 페이지 정보
	 * @return 유저의 프로필을 반환합니다.
	 */
	@GetMapping("/users-simple")
	@AuthGuard(level = ADMIN_ONLY)
	public UserProfilePaginationDto getUsersProfile(
			@RequestParam("name") String name, Pageable pageable) {
		return adminSearchFacadeService.getUsersProfile(name, pageable);
	}

	/**
	 * 유저가 빌린 사물함의 정보를 가져옵니다.
	 *
	 * @param name     검색하려는 partial 이름
	 * @param pageable 페이지 정보
	 * @return 유저가 빌린 사물함의 정보를 반환합니다.
	 */
	@GetMapping("/users")
	@AuthGuard(level = ADMIN_ONLY)
	public UserCabinetPaginationDto getCabinetsLentInfo(
			@RequestParam("name") String name, Pageable pageable) {
		return adminSearchFacadeService.getUserLentCabinetInfo(name, pageable);
	}
}
