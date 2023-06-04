package org.ftclub.cabinet.user.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/admin")
public class AdminUserController {

	private final UserFacadeService userFacadeService;
	private final LentFacadeService lentFacadeService;

	/**
	 * 유저 이름의 일부를 입력받아 해당 유저들의 프로필을 반환합니다.
	 *
	 * @param name   유저 이름의 일부
	 * @param page   페이지 번호
	 * @param length 페이지 당 길이
	 * @return {@link UserProfilePaginationDto} 해당하는 유저들의 프로필
	 */
	@GetMapping("/search/users/{name}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public ResponseEntity<UserProfilePaginationDto> getUserProfileListByPartialName(
			@PathVariable("name") String name,
			@RequestParam("page") Integer page, @RequestParam("length") Integer length) {
		UserProfilePaginationDto userProfilePaginationDto = userFacadeService.getUserProfileListByPartialName(
				name, page, length);
		if (userProfilePaginationDto.getTotalPage() == 0) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(userProfilePaginationDto);
	}

	/**
	 * 유저 이름의 일부를 입력받아 해당 유저들의 캐비넷 정보를 반환합니다.
	 *
	 * @param name   유저 이름의 일부
	 * @param page   페이지 번호
	 * @param length 페이지 당 길이
	 * @return {@link UserCabinetPaginationDto} 해당하는 유저들의 캐비넷 정보
	 */
	@GetMapping("/search/users")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public ResponseEntity<UserCabinetPaginationDto> findUserCabinetListByPartialName(
			@RequestParam("name") String name,
			@RequestParam("page") Integer page, @RequestParam("length") Integer length) {
		UserCabinetPaginationDto userCabinetPaginationDto = userFacadeService
				.findUserCabinetListByPartialName(name, page, length);
		if (userCabinetPaginationDto.getTotalPage() == 0) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(userCabinetPaginationDto);
	}

	/**
	 * 차단된 유저 리스트를 받아옵니다.
	 *
	 * @param page   페이지 번호
	 * @param length 페이지 당 길이
	 * @return {@link BlockedUserPaginationDto} 차단된 유저 리스트 혹은 204 No Content
	 */
	@GetMapping("/search/users/banned")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public ResponseEntity<BlockedUserPaginationDto> getBannedUsersList(
			@RequestParam("page") Integer page,
			@RequestParam("length") Integer length) {
		BlockedUserPaginationDto blockedUserPaginationDto = userFacadeService
				.getAllBanUsers(page, length, DateUtil.getNow());
		if (blockedUserPaginationDto.getTotalPage() == 0) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(blockedUserPaginationDto);
	}

	/**
	 * 현재 유저가 차단된 상태일 때, 차단을 해제합니다.
	 *
	 * @param userId 유저 고유 아이디
	 */
	@DeleteMapping("/log/users/{userId}/ban-history")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void deleteBanHistoryByUserId(@PathVariable("userId") Long userId) {
		userFacadeService.deleteRecentBanHistory(userId, DateUtil.getNow());
	}

	/**
	 * 유저의 대여 기록을 반환합니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @param page   페이지 번호
	 * @param length 페이지 당 길이
	 * @return {@link LentHistoryPaginationDto} 유저의 대여 기록
	 */
	@GetMapping("/log/users/{userId}/lent-histories")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public LentHistoryPaginationDto getLentHistoriesByUserId(@PathVariable("userId") Long userId,
			@RequestParam("page") Integer page,
			@RequestParam("length") Integer length) {
		return lentFacadeService.getAllUserLentHistories(userId, page, length);
	}

	// 동아리 유저 생성하는 메서드 필요
	/**
	 * ToDo:
	 * /api/admin/develop/promote
	 * /api/admin/search/user/overdue
	 */
}
