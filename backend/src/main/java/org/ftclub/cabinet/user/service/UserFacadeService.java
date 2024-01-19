package org.ftclub.cabinet.user.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.fcm.config.FirebaseConfig;
import org.ftclub.cabinet.alarm.fcm.service.FCMTokenRedisService;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.dto.LentExtensionPaginationDto;
import org.ftclub.cabinet.dto.LentExtensionResponseDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UpdateAlarmRequestDto;
import org.ftclub.cabinet.dto.UpdateDeviceTokenRequestDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.LentExtensionPolicy;
import org.ftclub.cabinet.user.domain.LentExtensions;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class UserFacadeService {

	private final BanHistoryQueryService banHistoryQueryService;
	private final CabinetQueryService cabinetQueryService;
	private final LentExtensionQueryService lentExtensionQueryService;
	private final LentExtensionCommandService lentExtensionCommandService;
	private final LentQueryService lentQueryService;
	private final LentExtensionPolicy lentExtensionPolicy;
	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final UserMapper userMapper;
	private final FCMTokenRedisService fcmTokenRedisService;
	private final FirebaseConfig firebaseConfig;

	/**
	 * 유저의 프로필을 가져옵니다.
	 *
	 * @param user 유저의 세션 정보
	 * @return 유저의 프로필 정보를 반환합니다.
	 */
	public MyProfileResponseDto getProfile(UserSessionDto user) {
		Cabinet cabinet = cabinetQueryService.findUserActiveCabinet(user.getUserId());
		BanHistory banHistory = banHistoryQueryService.findRecentActiveBanHistory(user.getUserId(),
				LocalDateTime.now()).orElse(null);
		LentExtension lentExtension = lentExtensionQueryService.findActiveLentExtension(
				user.getUserId());
		LentExtensionResponseDto lentExtensionResponseDto = userMapper.toLentExtensionResponseDto(
				lentExtension);
		User currentUser = userQueryService.getUser(user.getUserId());
		boolean isDeviceTokenExpired = currentUser.getAlarmTypes().isPush()
				&& fcmTokenRedisService.findByUserName(user.getName()).isEmpty();
		return userMapper.toMyProfileResponseDto(user, cabinet, banHistory,
				lentExtensionResponseDto, currentUser.getAlarmTypes(), isDeviceTokenExpired);
	}

	/**
	 * 유저의 모든 연장권 정보를 가져옵니다.
	 *
	 * @param user 유저의 세션 정보
	 * @return 유저의 모든 연장권 정보를 반환합니다.
	 */
	public LentExtensionPaginationDto getLentExtensions(UserSessionDto user) {
		List<LentExtensionResponseDto> lentExtensionResponseDtos = lentExtensionQueryService.findLentExtensionsInLatestOrder(
						user.getUserId())
				.stream()
				.map(userMapper::toLentExtensionResponseDto)
				.collect(Collectors.toList());
		return userMapper.toLentExtensionPaginationDto(lentExtensionResponseDtos,
				(long) lentExtensionResponseDtos.size());
	}

	/**
	 * 유저의 사용 가능한 연장권을 가져옵니다.
	 *
	 * @param user 유저의 세션 정보
	 * @return 유저의 사용 가능한 연장권 정보를 반환합니다.
	 */
	public LentExtensionPaginationDto getActiveLentExtensionsPage(UserSessionDto user) {
		LentExtensions lentExtensions = lentExtensionQueryService.findActiveLentExtensions(
				user.getUserId());
		List<LentExtensionResponseDto> LentExtensionResponseDtos = lentExtensions.getLentExtensions()
				.stream()
				.map(userMapper::toLentExtensionResponseDto)
				.collect(Collectors.toList());

		return userMapper.toLentExtensionPaginationDto(LentExtensionResponseDtos,
				(long) LentExtensionResponseDtos.size());
	}

	/**
	 * 연장권을 사용합니다.
	 *
	 * @param user 유저의 세션 정보
	 */
	public void useLentExtension(UserSessionDto user) {
		Cabinet cabinet = cabinetQueryService.getUserActiveCabinetForUpdate(user.getUserId());
		List<LentHistory> activeLentHistories = lentQueryService.findCabinetActiveLentHistories(
				cabinet.getId());
		lentExtensionPolicy.verifyLentExtension(cabinet, activeLentHistories);

		LentExtension activeLentExtension = lentExtensionQueryService.findActiveLentExtension(
				user.getUserId());
		if (activeLentExtension == null) {
			throw ExceptionStatus.EXTENSION_NOT_FOUND.asServiceException();
		}
		lentExtensionCommandService.useLentExtension(activeLentExtension, activeLentHistories);
	}

	/**
	 * 유저의 알람 설정을 변경합니다.
	 *
	 * @param userSessionDto        유저의 세션 정보
	 * @param updateAlarmRequestDto 변경할 알람 설정 정보
	 */
	@Transactional
	public void updateAlarmState(UserSessionDto userSessionDto,
			UpdateAlarmRequestDto updateAlarmRequestDto) {
		User user = userQueryService.getUser(userSessionDto.getUserId());
		userCommandService.updateAlarmStatus(user, updateAlarmRequestDto);
	}

	/**
	 * 유저의 디바이스 토큰 정보를 업데이트합니다.
	 *
	 * @param userSessionDto              유저의 세션 정보
	 * @param updateDeviceTokenRequestDto 디바이스 토큰 정보
	 */
	@Transactional
	public void updateDeviceToken(UserSessionDto userSessionDto,
			UpdateDeviceTokenRequestDto updateDeviceTokenRequestDto) {
		User user = userQueryService.getUser(userSessionDto.getUserId());
		fcmTokenRedisService.saveToken(
				user.getName(),
				updateDeviceTokenRequestDto.getDeviceToken(),
				Duration.ofDays(firebaseConfig.getDeviceTokenExpiryDays())
		);
	}
}

