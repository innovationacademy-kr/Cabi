package org.ftclub.cabinet.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Date;
import org.ftclub.cabinet.dto.BlockedUserDto;
import org.ftclub.cabinet.dto.UserProfileDto;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserMapperTest {

    @Autowired
    UserMapper userMapper;

    @Test
    void toBlockedUserDto() {
        BanHistory banHistory = BanHistory.of(new Date(), new Date(), BanType.PRIVATE, 3L);
        String name = "intraId";
        BlockedUserDto blockedUserDto = userMapper.toBlockedUserDto(banHistory.getUserId(), name,
                banHistory.getBannedAt(), banHistory.getUnbannedAt());
        assertEquals(banHistory.getUserId(), blockedUserDto.getUserId());
        assertEquals(name, blockedUserDto.getName());
        assertEquals(banHistory.getBannedAt(), blockedUserDto.getBannedAt());
        assertEquals(banHistory.getUnbannedAt(), blockedUserDto.getUnbannedAt());
    }

    @Test
    void toUserProfileDto() {
        User user = User.of("intraId", "user@email.com", new Date(), UserRole.USER);
        UserProfileDto userProfileDto = userMapper.toUserProfileDto(user.getUserId(),
                user.getName());
        assertEquals(user.getUserId(), userProfileDto.getUserId());
        assertEquals(user.getName(), userProfileDto.getName());
    }
}
