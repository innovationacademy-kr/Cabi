package org.ftclub.cabinet.admin.user.controller;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.lent.service.AdminLentFacadeService;
import org.ftclub.cabinet.admin.user.service.AdminLentExtensionFacadeService;
import org.ftclub.cabinet.admin.user.service.AdminUserFacadeService;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/users")
@Logging
public class AdminUserController {

	private final AdminUserFacadeService adminUserFacadeService;
	private final AdminLentFacadeService adminLentFacadeService;
	private final AdminLentExtensionFacadeService adminLentExtensionFacadeService;

	/**
	 * 현재 유저가 차단된 상태일 때, 차단을 해제합니다.
	 *
	 * @param userId 유저 고유 아이디
	 */
	@DeleteMapping("/{userId}/ban-history")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void deleteBanHistoryByUserId(@PathVariable("userId") Long userId) {
		adminUserFacadeService.deleteRecentBanHistory(userId, LocalDateTime.now());
	}

	// TODO : 안 쓰는 부분인 것 확정 되면 삭제
//	@GetMapping("/lent-extensions")
//	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
//	public LentExtensionPaginationDto getAllLentExtension(@RequestParam("page") Integer page,
//	                                                      @RequestParam("size") Integer size) {
//		log.info("Called getAllLentExtension");
//		return adminUserFacadeService.getAllLentExtension(page, size);
//	}
//
//	@GetMapping("/lent-extensions/active")
//	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
//	public LentExtensionPaginationDto getAllActiveLentExtension(@RequestParam("page") Integer page,
//	                                                            @RequestParam("size") Integer size) {
//		log.info("Called getAllActiveLentExtension");
//		return adminUserFacadeService.getAllActiveLentExtension(page, size);
//	}

	/**
	 * 유저의 대여 기록을 반환합니다.
	 *
	 * @param userId   유저 고유 아이디
	 * @param pageable 페이지네이션 정보
	 * @return {@link LentHistoryPaginationDto} 유저의 대여 기록
	 */
	@GetMapping("/{userId}/lent-histories")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public LentHistoryPaginationDto getLentHistoriesByUserId(
			@PathVariable("userId") Long userId, Pageable pageable) {
		return adminLentFacadeService.getUserLentHistories(userId, pageable);
	}

	/**
	 * 유저의 연장권 발급 기록을 반환합니다.
	 *
	 * @param username 유저 이름
	 */
	@PostMapping("/lent-extensions/{user}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void issueLentExtension(@PathVariable("user") String username) {
		adminLentExtensionFacadeService.assignLentExtension(username);
	}
}
