package org.ftclub.cabinet.user.controller;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 관리자가 유저를 관리할 때 사용하는 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/users")
@Log4j2
public class AdminUserController {

	private final UserFacadeService userFacadeService;
	private final LentFacadeService lentFacadeService;

	/**
	 * 현재 유저가 차단된 상태일 때, 차단을 해제합니다.
	 *
	 * @param userId 유저 고유 아이디
	 */
	@DeleteMapping("/{userId}/ban-history")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void deleteBanHistoryByUserId(@PathVariable("userId") Long userId) {
		log.info("Called deleteBanHistoryByUserId: {}", userId);
		userFacadeService.deleteRecentBanHistory(userId, LocalDateTime.now());
	}

	/**
	 * 유저의 대여 기록을 반환합니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @param page   페이지 번호
	 * @param size   페이지 당 길이
	 * @return {@link LentHistoryPaginationDto} 유저의 대여 기록
	 */
	@GetMapping("/{userId}/lent-histories")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public LentHistoryPaginationDto getLentHistoriesByUserId(@PathVariable("userId") Long userId,
			@RequestParam("page") Integer page,
			@RequestParam("size") Integer size) {
		log.info("Called getLentHistoriesByUserId: {}", userId);
		return lentFacadeService.getAllUserLentHistories(userId, page, size);
	}

	/**
	 * 유저를 어드민으로 승격시킵니다.
	 *
	 * @param email 유저 이메일
	 * @return redirect:cabi.42seoul.io/admin/login
	 */
	@GetMapping("/admins/promote")
	@AuthGuard(level = AuthLevel.MASTER_ONLY)
	public void promoteUserToAdmin(@RequestParam("email") String email) {
		log.info("Called promoteUserToAdmin: {}", email);
		userFacadeService.promoteUserToAdmin(email);
	}
}
