package org.ftclub.cabinet.user.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.security.UserInfoDto;
import org.ftclub.cabinet.dto.LentExtensionPaginationDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UpdateAlarmRequestDto;
import org.ftclub.cabinet.dto.UpdateDeviceTokenRequestDto;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
	public MyProfileResponseDto getMyProfile(
			@AuthenticationPrincipal UserInfoDto userSessionDto) {
		return userFacadeService.getProfile(userSessionDto.getUserId());
	}

	/**
	 * 현재 로그인한 유저의 사용가능한 연장권 정보를 리턴합니다.
	 *
	 * @param userInfoDto 현재 로그인한 유저의 세션 정보
	 * @return {@link LentExtensionPaginationDto} 현재 로그인한 유저의 활성화중인 연장권 정보
	 */
	@GetMapping("/me/lent-extensions/active")
	public LentExtensionPaginationDto getMyActiveLentExtension(
			@AuthenticationPrincipal UserInfoDto userInfoDto) {
		return userFacadeService.getActiveLentExtensions(userInfoDto.getUserId());
	}

	/**
	 * 현재 로그인한 유저의 연장권을 사용합니다.
	 *
	 * @param userInfoDto 현재 로그인한 유저의 세션 정보
	 */
	@PostMapping("/me/lent-extensions")
	public void useLentExtension(
			@AuthenticationPrincipal UserInfoDto userInfoDto) {
		userFacadeService.useLentExtension(userInfoDto.getUserId());
	}

	@PutMapping("/me/alarms")
	public void updateMyProfile(
			@AuthenticationPrincipal UserInfoDto userInfoDto,
			@RequestBody UpdateAlarmRequestDto updateAlarmRequestDto) {
		userFacadeService.updateAlarmState(userInfoDto.getUserId(), updateAlarmRequestDto);
	}

	@PutMapping("/me/device-token")
	public void updateDeviceToken(
			@AuthenticationPrincipal UserInfoDto userInfoDto,
			@RequestBody UpdateDeviceTokenRequestDto updateDeviceTokenRequestDto) {
		userFacadeService.updateDeviceToken(userInfoDto.getUserId(), updateDeviceTokenRequestDto);
	}
}
