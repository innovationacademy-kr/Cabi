package org.ftclub.cabinet.admin.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.admin.admin.service.AdminFacadeService;
import org.ftclub.cabinet.admin.lent.AdminLentFacadeService;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.ClubUserListDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/users")
@Log4j2
public class AdminUserController {
	private final AdminFacadeService adminFacadeService;
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
		log.info("Called deleteBanHistoryByUserId: {}", userId);
		adminUserFacadeService.deleteRecentBanHistory(userId, LocalDateTime.now());
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
		adminFacadeService.promoteAdminByEmail(email);
	}

	/**
	 * 동아리 유저를 생성합니다.
	 *
	 * @param body 동아리 이름
	 */
	@PostMapping("/club")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void createClubUser(@RequestBody HashMap<String, String> body) {
		log.info("Called createClub");
		String clubName = body.get("clubName");
		adminUserFacadeService.createClubUser(clubName);
	}

	/**
	 * 동아리 유저를 삭제합니다.
	 *
	 * @param clubId 동아리 고유 아이디
	 */
	@DeleteMapping("/club/{clubId}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void deleteClubUser(@PathVariable("clubId") Long clubId) {
		log.info("Called deleteClub");
		adminUserFacadeService.deleteClubUser(clubId);
	}

	@GetMapping("/clubs")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public ClubUserListDto findClubs(@RequestParam("page") Integer page,
	                                 @RequestParam("size") Integer size) {
		log.info("Called getClubs");
		Pageable pageable = Pageable.ofSize(size).withPage(page);
		return adminUserFacadeService.findAllClubUsers(pageable);
	}

	@PatchMapping("/club/{clubId}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void updateClubUser(@PathVariable("clubId") Long clubId,
	                           @RequestBody HashMap<String, String> body) {
		log.info("Called updateClub");
		String clubName = body.get("clubName");
		adminUserFacadeService.updateClubUser(clubId, clubName);
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
		log.info("Called getLentHistoriesByUserId: {}", userId);
		return adminLentFacadeService.getUserLentHistories(userId, pageable);
	}

	@PostMapping("/lent-extensions/{user}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void issueLentExtension(@PathVariable("user") String username) {
		log.info("Called issueLentExtension");
		adminLentExtensionFacadeService.assignLentExtension(username);
	}
}
