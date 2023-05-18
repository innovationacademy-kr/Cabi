package org.ftclub.cabinet.user.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.AuthGuard;
import org.ftclub.cabinet.auth.AuthGuard.Level;
import org.ftclub.cabinet.auth.User;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetInfoResponseDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 유저가 자신의 정보를 확인할 때 사용하는 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

	private final UserFacadeService userFacadeService;

	/**
	 * 현재 로그인한 유저의 프로필을 반환합니다. 전체 사물함 뷰에서 본인의 사물함을 표시하기 위해 사용됩니다.
	 *
	 * @param userSessionDto
	 * @return MyProfileResponseDto
	 */
	@GetMapping("/me")
	@AuthGuard(level = Level.USER_ONLY)
	public MyProfileResponseDto getMyProfile(@User UserSessionDto userSessionDto) {
		return userFacadeService.getMyProfile(userSessionDto);
	}

	/**
	 * 현재 로그인한 유저의 대여 정보와 대여한 사물함 정보를 반환합니다.
	 *
	 * @param userSessionDto
	 * @return MyCabinetInfoResponseDto
	 */
	@GetMapping("/me/lent")
	@AuthGuard(level = Level.USER_ONLY)
	public MyCabinetInfoResponseDto getMyLentAndCabinetInfo(@User UserSessionDto userSessionDto) {
		return userFacadeService.getMyLentAndCabinetInfo(
				userSessionDto.getUserId());
	}

	/**
	 * 현재 로그인한 유저의 대여 기록을 반환합니다.
	 *
	 * @param userSessionDto
	 * @param page
	 * @param length
	 * @return LentHistoryPaginationDto
	 */
	@GetMapping("/me/lent/histories")
	@AuthGuard(level = Level.USER_ONLY)
	public LentHistoryPaginationDto getMyLentHistories(@User UserSessionDto userSessionDto,
			@RequestParam("page") Integer page, @RequestParam("length") Integer length) {
		return userFacadeService.getUserLentHistories(
				userSessionDto.getUserId(), page, length);
	}
}
