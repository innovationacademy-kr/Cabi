package org.ftclub.cabinet.user.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.AuthGuard;
import org.ftclub.cabinet.auth.AuthGuard.Level;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminUserController {

	private final UserFacadeService userFacadeService;

	@GetMapping("/search/users/{name}")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public UserProfilePaginationDto getUserProfileListByPartialName(
			@PathVariable("name") String name,
			@RequestParam("page") Integer page, @RequestParam("length") Integer length) {
		return userFacadeService.getUserProfileListByPartialName(name, page, length);
	}

	@GetMapping("/search/users")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public UserCabinetPaginationDto findUserCabinetListByPartialName(
			@RequestParam("name") String name,
			@RequestParam("page") Integer page, @RequestParam("length") Integer length) {
		return userFacadeService.findUserCabinetListByPartialName(name, page, length);
	}

	@GetMapping("/search/users/banned")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public BlockedUserPaginationDto getBannedUsersList(@RequestParam("page") Integer page,
			@RequestParam("length") Integer length) {
		return userFacadeService.getAllBanUsers(page, length);
	}

	@DeleteMapping("/log/users/{userId}/ban-history")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public void deleteBanHistoryByUserId(@PathVariable("userId") Long userId) {
		userFacadeService.unbanUser(userId, DateUtil.getNow());
	}

	@GetMapping("/log/users/{userId}/lent-histories")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public LentHistoryPaginationDto getLentHistoriesByUserId(@PathVariable("userId") Long userId,
			@RequestParam("page") Integer page,
			@RequestParam("length") Integer length) {
		return userFacadeService.getUserLentHistories(userId, page, length);
	}
}
