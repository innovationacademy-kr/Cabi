package org.ftclub.cabinet.admin.user.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminClubUserRequestDto;
import org.ftclub.cabinet.admin.lent.service.AdminLentFacadeService;
import org.ftclub.cabinet.admin.user.service.AdminLentExtensionFacadeService;
import org.ftclub.cabinet.admin.user.service.AdminUserFacadeService;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.ClubUserListDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;

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

	/**
	 * 동아리 유저를 생성합니다.
	 *
	 * @param dto 동아리 이름
	 */
	@PostMapping("/club")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void createClubUser(@RequestBody AdminClubUserRequestDto dto) {
		adminUserFacadeService.createClubUser(dto.getClubName());
	}

	/**
	 * 동아리 유저를 삭제합니다.
	 *
	 * @param clubId 동아리 고유 아이디
	 */
	@DeleteMapping("/club/{clubId}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void deleteClubUser(@PathVariable("clubId") Long clubId) {
		adminUserFacadeService.deleteClubUser(clubId);
	}

	@GetMapping("/clubs")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public ClubUserListDto findClubs(@Valid Pageable pageable) {
		return adminUserFacadeService.findAllClubUsers(pageable);
	}

	@PatchMapping("/club/{clubId}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void updateClubUser(@PathVariable("clubId") Long clubId,
	                           @Valid @RequestBody AdminClubUserRequestDto dto) {
		adminUserFacadeService.updateClubUser(clubId, dto.getClubName());
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

	@PostMapping("/lent-extensions/{user}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void issueLentExtension(@PathVariable("user") String username) {
		adminLentExtensionFacadeService.assignLentExtension(username);
	}
}
