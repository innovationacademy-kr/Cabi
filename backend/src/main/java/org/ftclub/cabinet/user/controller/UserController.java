package org.ftclub.cabinet.user.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetResponseDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.domain.UserSession;
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
	private final LentFacadeService lentFacadeService;

	/**
	 * 현재 로그인한 유저의 프로필을 반환합니다. 전체 사물함 뷰에서 본인의 사물함을 표시하기 위해 사용됩니다.
	 *
	 * @param userSessionDto 현재 로그인한 유저의 세션 정보
	 * @return {@link MyProfileResponseDto} 현재 로그인한 유저의 프로필
	 */
	@GetMapping("/me")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public MyProfileResponseDto getMyProfile(@UserSession UserSessionDto userSessionDto) {
		return userFacadeService.getMyProfile(userSessionDto);
	}

	/**
	 * 현재 로그인한 유저의 대여 정보와 대여한 사물함 정보를 반환합니다.
	 *
	 * @param userSessionDto 현재 로그인한 유저의 세션 정보
	 * @return {@link MyCabinetResponseDto} 현재 로그인한 유저의 대여 정보와 대여한 사물함 정보
	 */
	@GetMapping("/me/lent")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public MyCabinetResponseDto getMyLentAndCabinetInfo(
			@UserSession UserSessionDto userSessionDto) {
		return userFacadeService.getMyLentAndCabinetInfo(
				userSessionDto.getUserId());
	}

	/**
	 * 현재 로그인한 유저의 대여 기록을 반환합니다.
	 *
	 * @param userSessionDto 현재 로그인한 유저의 세션 정보
	 * @param page           페이지 번호
	 * @param length         페이지 당 길이
	 * @return {@link LentHistoryPaginationDto} 현재 로그인한 유저의 대여 기록
	 */
	@GetMapping("/me/lent/histories")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public LentHistoryPaginationDto getMyLentHistories(@UserSession UserSessionDto userSessionDto,
			@RequestParam("page") Integer page, @RequestParam("length") Integer length) {
		return lentFacadeService.getAllUserLentHistories(
				userSessionDto.getUserId(), page, length);
	}
}
