package org.ftclub.cabinet.user.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.LentExtensionPaginationDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UpdateAlarmRequestDto;
import org.ftclub.cabinet.dto.UpdateDeviceTokenRequestDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.UserSession;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 유저가 자신의 정보를 확인할 때 사용하는 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/users")
@Logging
public class UserController {

	private final UserFacadeService userFacadeService;

	/**
	 * 현재 로그인한 유저의 프로필을 반환합니다. 전체 사물함 뷰에서 본인의 사물함을 표시하기 위해 사용됩니다.
	 *
	 * @param userSessionDto 현재 로그인한 유저의 세션 정보
	 * @return {@link MyProfileResponseDto} 현재 로그인한 유저의 프로필
	 */
	@GetMapping("/me")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public MyProfileResponseDto getMyProfile(@UserSession UserSessionDto userSessionDto) {
		return userFacadeService.getProfile(userSessionDto);
	}

	/**
	 * 현재 로그인한 유저의 사용가능한 연장권 정보를 리턴합니다.
	 *
	 * @param userSessionDto 현재 로그인한 유저의 세션 정보
	 * @return {@link LentExtensionPaginationDto} 현재 로그인한 유저의 활성화중인 연장권 정보
	 */
	@GetMapping("/me/lent-extensions/active")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public LentExtensionPaginationDto getMyActiveLentExtension(
			@UserSession UserSessionDto userSessionDto) {
		return userFacadeService.getActiveLentExtensions(userSessionDto);
	}

	/**
	 * 현재 로그인한 유저의 연장권을 사용합니다.
	 *
	 * @param userSessionDto 현재 로그인한 유저의 세션 정보
	 */
	@PostMapping("/me/lent-extensions")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void useLentExtension(
			@UserSession UserSessionDto userSessionDto) {
		userFacadeService.useLentExtension(userSessionDto);
	}

	@PutMapping("/me/alarms")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void updateMyProfile(
			@UserSession UserSessionDto userSessionDto,
			@RequestBody UpdateAlarmRequestDto updateAlarmRequestDto) {
		userFacadeService.updateAlarmState(userSessionDto, updateAlarmRequestDto);
	}

	@PutMapping("/me/device-token")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void updateDeviceToken(
			@UserSession UserSessionDto userSessionDto,
			@RequestBody UpdateDeviceTokenRequestDto updateDeviceTokenRequestDto) {
		userFacadeService.updateDeviceToken(userSessionDto, updateDeviceTokenRequestDto);
	}
}
