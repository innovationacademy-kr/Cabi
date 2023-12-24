package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.dto.AlarmTypeResponseDto;
import org.ftclub.cabinet.alarm.service.AlarmCommandService;
import org.ftclub.cabinet.alarm.service.AlarmQueryService;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.newService.CabinetQueryService;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.*;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserFacadeService {

	private final BanHistoryQueryService banHistoryQueryService;
	private final LentExtensionQueryService lentExtensionQueryService;
	private final LentExtensionCommandService lentExtensionCommandService;
	private final CabinetQueryService cabinetQueryService;
	private final UserMapper userMapper;
	private final AlarmQueryService alarmQueryService;
	private final AlarmCommandService alarmCommandService;
	private final LentQueryService lentQueryService;
	private final LentExtensionPolicy lentExtensionPolicy;

	public MyProfileResponseDto getProfile(UserSessionDto user) {
		log.debug("Called getMyProfile: {}", user.getName());

		Cabinet cabinet = cabinetQueryService.findUserActiveCabinet(user.getUserId());
		BanHistory banHistory = banHistoryQueryService.findRecentActiveBanHistory(user.getUserId(), LocalDateTime.now()).orElse(null);
		LentExtension lentExtension = lentExtensionQueryService.findActiveLentExtension(user.getUserId());
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

    public LentExtensionPaginationDto getLentExtensions(UserSessionDto user) {
        log.debug("Called getMyLentExtension : {}", user.getName());

        List<LentExtensionResponseDto> lentExtensionResponseDtos = lentExtensionQueryService.findLentExtensionsInLatestOrder(user.getUserId())
                .stream()
                .map(userMapper::toLentExtensionResponseDto)
                .collect(Collectors.toList());
        return userMapper.toLentExtensionPaginationDto(lentExtensionResponseDtos, (long) lentExtensionResponseDtos.size());
    }

	public LentExtensionPaginationDto getActiveLentExtensionsPage(UserSessionDto user) {
		log.debug("Called getMyActiveLentExtension : {}", user.getName());

		LentExtensions lentExtensions = lentExtensionQueryService.findActiveLentExtensions(user.getUserId());
		List<LentExtensionResponseDto> LentExtensionResponseDtos = lentExtensions.getLentExtensions()
				.stream()
				.map(userMapper::toLentExtensionResponseDto)
				.collect(Collectors.toList());

		return userMapper.toLentExtensionPaginationDto(LentExtensionResponseDtos, (long) LentExtensionResponseDtos.size());
	}

	public void useLentExtension(UserSessionDto user) {
		log.debug("Called useLentExtension : {}", user.getName());

		Cabinet cabinet = cabinetQueryService.getCabinets(user.getUserId());
		List<LentHistory> activeLentHistories = lentQueryService.findCabinetActiveLentHistories(cabinet.getCabinetId());
		lentExtensionPolicy.verifyLentExtension(cabinet, activeLentHistories);

		LentExtension activeLentExtension = lentExtensionQueryService.findActiveLentExtension(user.getUserId());
		if (activeLentExtension == null) {
			throw new ServiceException(ExceptionStatus.EXTENSION_NOT_FOUND);
		}
		lentExtensionCommandService.useLentExtension(activeLentExtension, activeLentHistories);
	}

	@Transactional
	public void updateAlarmState(UserSessionDto user, UpdateAlarmRequestDto dto) {
		log.debug("Called updateAlarmState");

		alarmCommandService.updateAlarmStatusRe(dto, alarmQueryService.findAlarmStatus(
				user.getUserId()));
	}
}

