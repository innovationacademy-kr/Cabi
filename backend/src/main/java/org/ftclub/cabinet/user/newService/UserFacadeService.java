package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.LentExtensionResponseDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserFacadeService {

    private final BanHistoryQueryService banHistoryQueryService;
    private final LentExtensionQueryService lentExtensionQueryService;
    private final UserMapper userMapper;

    public MyProfileResponseDto getMyProfile(UserSessionDto user) {
        log.debug("Called getMyProfile: {}", user.getName());

//        Cabinet cabinet = cabinetQueryService.findActiveLentCabinetByUserId();
        BanHistory banHistory = banHistoryQueryService.findRecentActiveBanHistory(user.getUserId(), LocalDateTime.now());
        LentExtension lentExtension = lentExtensionQueryService.getActiveLentExtension(user);

        return userMapper.toMyProfileResponseDto(user, cabinet, banHistory,
                LentExtensionResponseDto.builder()
                        .lentExtensionId(lentExtension.getLentExtensionId())
                        .name(lentExtension.getName())
                        .extensionPeriod(lentExtension.getExtensionPeriod())
                        .expiredAt(lentExtension.getExpiredAt().toString())
                        .lentExtensionType(lentExtension.getLentExtensionType()));
    }
}

