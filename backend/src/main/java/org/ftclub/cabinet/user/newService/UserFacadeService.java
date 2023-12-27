package org.ftclub.cabinet.user.newService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.dto.AlarmTypeResponseDto;
import org.ftclub.cabinet.alarm.service.AlarmCommandService;
import org.ftclub.cabinet.alarm.service.AlarmQueryService;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.newService.CabinetQueryService;
import org.ftclub.cabinet.dto.LentExtensionPaginationDto;
import org.ftclub.cabinet.dto.LentExtensionResponseDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UpdateAlarmRequestDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.AlarmStatus;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.LentExtensionPolicy;
import org.ftclub.cabinet.user.domain.LentExtensions;
import org.springframework.stereotype.Service;

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
		BanHistory banHistory = banHistoryQueryService.findRecentActiveBanHistory(user.getUserId(),
				LocalDateTime.now()).orElse(null);
		LentExtension lentExtension = lentExtensionQueryService.findActiveLentExtension(
				user.getUserId());
		LentExtensionResponseDto lentExtensionResponseDto = userMapper.toLentExtensionResponseDto(lentExtension);

		AlarmStatus alarmStatus = alarmQueryService.findAlarmStatus(user.getUserId());
		AlarmTypeResponseDto alarmTypeResponseDto = userMapper.toAlarmTypeResponseDto(alarmStatus);

		return userMapper.toMyProfileResponseDto(user, cabinet, banHistory,
				lentExtensionResponseDto, alarmTypeResponseDto);
	}

	public LentExtensionPaginationDto getLentExtensions(UserSessionDto user) {
		log.debug("Called getMyLentExtension : {}", user.getName());

		List<LentExtensionResponseDto> lentExtensionResponseDtos = lentExtensionQueryService.findLentExtensionsInLatestOrder(
						user.getUserId())
				.stream()
				.map(userMapper::toLentExtensionResponseDto)
				.collect(Collectors.toList());
		return userMapper.toLentExtensionPaginationDto(lentExtensionResponseDtos,
				(long) lentExtensionResponseDtos.size());
	}

	public LentExtensionPaginationDto getActiveLentExtensionsPage(UserSessionDto user) {
		log.debug("Called getMyActiveLentExtension : {}", user.getName());

		LentExtensions lentExtensions = lentExtensionQueryService.findActiveLentExtensions(
				user.getUserId());
		List<LentExtensionResponseDto> LentExtensionResponseDtos = lentExtensions.getLentExtensions()
				.stream()
				.map(userMapper::toLentExtensionResponseDto)
				.collect(Collectors.toList());

		return userMapper.toLentExtensionPaginationDto(LentExtensionResponseDtos,
				(long) LentExtensionResponseDtos.size());
	}

	public void useLentExtension(UserSessionDto user) {
		log.debug("Called useLentExtension : {}", user.getName());

		Cabinet cabinet = cabinetQueryService.findCabinets(user.getUserId());
		List<LentHistory> activeLentHistories = lentQueryService.findCabinetActiveLentHistories(
				cabinet.getCabinetId());
		lentExtensionPolicy.verifyLentExtension(cabinet, activeLentHistories);

		LentExtension activeLentExtension = lentExtensionQueryService.findActiveLentExtension(
				user.getUserId());
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

