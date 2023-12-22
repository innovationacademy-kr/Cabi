package org.ftclub.cabinet.user.newService;

import io.netty.util.internal.StringUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.dto.AlarmTypeResponseDto;
import org.ftclub.cabinet.alarm.service.AlarmQueryService;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.newService.CabinetQueryService;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

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
        BanHistory banHistory = banHistoryQueryService.findRecentActiveBanHistory(user.getUserId(), LocalDateTime.now());
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
                .slack(alarmStatus.isSlack())
                .email(alarmStatus.isEmail())
                .push(alarmStatus.isPush())
                .build();
        
        return userMapper.toMyProfileResponseDto(user, cabinet, banHistory, lentExtensionResponseDto, alarmTypeResponseDto);
    }

    public void createClubUser(String clubName) {
        log.debug("Called createClubUser: {}", clubName);
        User user = userQueryService.findUser(clubName);
        if (StringUtil.isNullOrEmpty(clubName)) {
            throw new ControllerException(ExceptionStatus.INVALID_ARGUMENT);
        } else if (user != null && user.getDeletedAt() == null) {
            throw new ControllerException(ExceptionStatus.EXISTED_CLUB_USER);
        } else if (user != null) {
            user.setDeletedAt(null);
        } else {
            String randomUUID = UUID.randomUUID().toString();
            User newUser = User.of(clubName, randomUUID + "@ftc.co.kr", null, UserRole.CLUB);
            userCommandService.createUser(newUser);
        }
    }
}

