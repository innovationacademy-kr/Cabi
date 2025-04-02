package org.ftclub.cabinet.user.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.dto.AlarmTypeResponseDto;
import org.ftclub.cabinet.alarm.fcm.config.FirebaseConfig;
import org.ftclub.cabinet.alarm.fcm.service.FCMTokenRedisService;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.dto.LentExtensionPaginationDto;
import org.ftclub.cabinet.dto.LentExtensionResponseDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UpdateAlarmRequestDto;
import org.ftclub.cabinet.dto.UpdateDeviceTokenRequestDto;
import org.ftclub.cabinet.dto.UserOauthConnectionDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.item.service.ItemRedisService;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.oauth.domain.FtOauthProfile;
import org.ftclub.cabinet.oauth.service.OauthLinkQueryService;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.LentExtensionPolicy;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
	private final BanHistoryCommandService banHistoryCommandService;
	private final ItemRedisService itemRedisService;
	private final OauthLinkQueryService oauthLinkQueryService;


	/**
	 * 유저의 프로필을 가져옵니다.
	 *
	 * @param userId 유저의 세션 정보
	 * @return 유저의 프로필 정보를 반환합니다.
	 */
	@Transactional(readOnly = true)
	public MyProfileResponseDto getProfile(Long userId) {
		User currentUser = userQueryService.getUser(userId);
		Cabinet cabinet = cabinetQueryService.findUserActiveCabinet(userId);
		BanHistory banHistory = banHistoryQueryService.
				findRecentActiveBanHistory(userId, LocalDateTime.now())
				.orElse(null);

		UserOauthConnectionDto userOauthConnectionDto = oauthLinkQueryService
				.findByUserId(currentUser.getId())
				.map(userMapper::toUserOauthConnectionDto)
				.orElse(null);

		AlarmTypeResponseDto userAlarmTypes = currentUser.getAlarmTypes();
		boolean isDeviceTokenExpired = userAlarmTypes.isPush()
				&& fcmTokenRedisService.findByUserName(currentUser.getName()).isEmpty();

		Long coins = currentUser.getCoin();
		return userMapper.toMyProfileResponseDto(currentUser, userOauthConnectionDto, cabinet,
				banHistory,
				userAlarmTypes,
				isDeviceTokenExpired, coins);
	}

	/**
	 * 유저의 사용 가능한 연장권을 가져옵니다.
	 *
	 * @param user 유저의 세션 정보
	 * @return 유저의 사용 가능한 연장권 정보를 반환합니다.
	 */
	@Transactional(readOnly = true)
	public LentExtensionPaginationDto getActiveLentExtensions(Long userId) {
		List<LentExtension> lentExtensions =
				lentExtensionQueryService.findActiveLentExtensions(userId);
		List<LentExtensionResponseDto> result = lentExtensions.stream()
				.map(userMapper::toLentExtensionResponseDto)
				.collect(Collectors.toList());

		return userMapper.toLentExtensionPaginationDto(result, (long) lentExtensions.size());
	}

	/**
	 * 연장권을 사용합니다.
	 *
	 * @param user 유저의 세션 정보
	 */
	@Transactional
	public void useLentExtension(Long userId) {
		Cabinet cabinet = cabinetQueryService.getUserActiveCabinetForUpdate(userId);
		List<LentHistory> activeLentHistories = lentQueryService.findCabinetActiveLentHistories(
				cabinet.getId());
		lentExtensionPolicy.verifyLentExtension(cabinet, activeLentHistories);

		LentExtension activeLentExtension = lentExtensionQueryService.findActiveLentExtension(
				userId);
		if (activeLentExtension == null) {
			throw ExceptionStatus.EXTENSION_NOT_FOUND.asServiceException();
		}
		lentExtensionCommandService.useLentExtension(activeLentExtension, activeLentHistories);
	}

	/**
	 * 유저의 알람 설정을 변경합니다.
	 *
	 * @param userId                유저 id
	 * @param updateAlarmRequestDto 변경할 알람 설정 정보
	 */
	@Transactional
	public void updateAlarmState(Long userId,
			UpdateAlarmRequestDto updateAlarmRequestDto) {
		User user = userQueryService.getUser(userId);
		userCommandService.updateAlarmStatus(user, updateAlarmRequestDto);
	}

	/**
	 * 유저의 디바이스 토큰 정보를 업데이트합니다.
	 *
	 * @param userId                      유저 id
	 * @param updateDeviceTokenRequestDto 디바이스 토큰 정보
	 */
	@Transactional
	public void updateDeviceToken(Long userId,
			UpdateDeviceTokenRequestDto updateDeviceTokenRequestDto) {
		User user = userQueryService.getUser(userId);
		fcmTokenRedisService.saveToken(
				user.getName(),
				updateDeviceTokenRequestDto.getDeviceToken(),
				Duration.ofDays(firebaseConfig.getDeviceTokenExpiryDays())
		);
	}

	/**
	 * 가장 최근 밴 당한 날짜에서 일자만큼 차감 후 업데이트
	 *
	 * @param userId
	 * @param days
	 */
	@Transactional
	public void reduceBanDays(Long userId, Integer days) {
		BanHistory recentBanHistory = banHistoryQueryService.getRecentBanHistory(userId);
		LocalDateTime reducedUnbannedAt = recentBanHistory.getUnbannedAt().minusDays(days);
		banHistoryCommandService.updateBanDate(recentBanHistory, reducedUnbannedAt);
	}

	@Transactional
	public User createOrUpdateUserFromProfile(FtOauthProfile profile) {
		User user = userQueryService.findUser(profile.getIntraName())
				.orElseGet(() -> userCommandService.createUserByFtOauthProfile(profile));

		String roles = FtRole.combineRolesToString(profile.getRoles());
		LocalDateTime blackHoledAt = profile.getBlackHoledAt();
		userCommandService.updateUserRoleAndBlackHoledAt(user, roles, blackHoledAt);
		return user;
	}

}

