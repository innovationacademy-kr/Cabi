package org.ftclub.cabinet.user.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.*;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

    public MyProfileResponseDto getProfile(UserSessionDto user) {
        Cabinet cabinet = cabinetQueryService.findUserActiveCabinet(user.getUserId());
        BanHistory banHistory = banHistoryQueryService.findRecentActiveBanHistory(user.getUserId(),
                LocalDateTime.now()).orElse(null);
        LentExtension lentExtension = lentExtensionQueryService.findActiveLentExtension(
                user.getUserId());

        LentExtensionResponseDto lentExtensionResponseDto = userMapper.toLentExtensionResponseDto(lentExtension);
        User currentUser = userQueryService.getUser(user.getUserId());
        return userMapper.toMyProfileResponseDto(user, cabinet, banHistory,
                lentExtensionResponseDto, currentUser.getAlarmTypes());
    }

    public LentExtensionPaginationDto getLentExtensions(UserSessionDto user) {
        List<LentExtensionResponseDto> lentExtensionResponseDtos = lentExtensionQueryService.findLentExtensionsInLatestOrder(
                        user.getUserId())
                .stream()
                .map(userMapper::toLentExtensionResponseDto)
                .collect(Collectors.toList());
        return userMapper.toLentExtensionPaginationDto(lentExtensionResponseDtos,
                (long) lentExtensionResponseDtos.size());
    }

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

    public void useLentExtension(UserSessionDto user) {
        Cabinet cabinet = cabinetQueryService.findCabinet(user.getUserId());
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

    @Transactional
    public void updateAlarmState(UserSessionDto userSessionDto, UpdateAlarmRequestDto updateAlarmRequestDto) {
        User user = userQueryService.getUser(userSessionDto.getUserId());
        userCommandService.updateAlarmStatus(user, updateAlarmRequestDto);
    }
}

