package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.dto.AlarmTypeResponseDto;
import org.ftclub.cabinet.alarm.service.AlarmQueryService;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.newService.CabinetQueryService;
import org.ftclub.cabinet.dto.LentExtensionResponseDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.AlarmStatus;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserFacadeService {

	private final BanHistoryQueryService banHistoryQueryService;
	private final LentExtensionQueryService lentExtensionQueryService;
	private final CabinetQueryService cabinetQueryService;
	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final UserMapper userMapper;
	private final AlarmQueryService alarmQueryService;

	public MyProfileResponseDto getMyProfile(UserSessionDto user) {
		log.debug("Called getMyProfile: {}", user.getName());

		Cabinet cabinet = cabinetQueryService.findUserActiveCabinet(user.getUserId());
		BanHistory banHistory = banHistoryQueryService.findRecentActiveBanHistory(user.getUserId(), LocalDateTime.now()).orElse(null);
		LentExtension lentExtension = lentExtensionQueryService.getActiveLentExtension(user);
		LentExtensionResponseDto lentExtensionResponseDto = LentExtensionResponseDto.builder()
				.lentExtensionId(lentExtension.getLentExtensionId())
				.name(lentExtension.getName())
				.extensionPeriod(lentExtension.getExtensionPeriod())
				.expiredAt(lentExtension.getExpiredAt().toString())
				.lentExtensionType(lentExtension.getLentExtensionType())
				.build();

		AlarmStatus alarmStatus = alarmQueryService.findAlarmStatus(user.getUserId());
		AlarmTypeResponseDto alarmTypeResponseDto = AlarmTypeResponseDto.builder()
				.alarmStatus(alarmStatus)
				.build();

		return userMapper.toMyProfileResponseDto(user, cabinet, banHistory, lentExtensionResponseDto, alarmTypeResponseDto);
	}

	// 동아리 유저 생성부분은 AdminUserFacadeService에서 하므로 주석처리했습니다.
//	public void createClubUser(String clubName) {
//		log.debug("Called createClubUser: {}", clubName);
//		User user = userQueryService.findUser(clubName).orElse(null);
//		if (StringUtil.isNullOrEmpty(clubName)) {
//			throw new ControllerException(ExceptionStatus.INVALID_ARGUMENT);
//		} else if (user != null && user.getDeletedAt() == null) {
//			throw new ControllerException(ExceptionStatus.EXISTED_CLUB_USER);
//		} else if (user != null) {
//			user.setDeletedAt(null);
//		} else {
//			String randomUUID = UUID.randomUUID().toString();
//			User newUser = User.of(clubName, randomUUID + "@ftc.co.kr", null, UserRole.CLUB);
//			userCommandService.save(newUser);
//		}
//	}

    public LentExtensionPaginationDto getMyLentExtension(UserSessionDto userSessionDto) {
        log.debug("Called getMyLentExtension");

        List<LentExtensionResponseDto> lentExtensionResponseDtos = lentExtensionQueryService.getMyLentExtensionSorted(userSessionDto.getUserId())
                .stream()
                .map(userMapper::toLentExtensionResponseDto)
                .collect(Collectors.toList());
        return userMapper.toLentExtensionPaginationDto(lentExtensionResponseDtos, (long) lentExtensionResponseDtos.size());
    }
}

