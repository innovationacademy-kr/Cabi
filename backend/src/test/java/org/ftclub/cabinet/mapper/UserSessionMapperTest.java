package org.ftclub.cabinet.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Date;
import org.ftclub.cabinet.dto.UserBlockedInfoDto;
import org.ftclub.cabinet.dto.UserProfileDto;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserSessionMapperTest {

	@Autowired
	UserMapper userMapper;

	@Test
	void toUserBlockedInfoDto() {
		BanHistory banHistory = BanHistory.of(new Date(), new Date(), BanType.PRIVATE, 3L);
		String name = "intraId";
		UserBlockedInfoDto userBlockedInfoDto = userMapper.toUserBlockedInfoDto(banHistory, name);
		assertEquals(banHistory.getUserId(), userBlockedInfoDto.getUserId());
		assertEquals(name, userBlockedInfoDto.getName());
		assertEquals(banHistory.getBannedAt(), userBlockedInfoDto.getBannedAt());
		assertEquals(banHistory.getUnbannedAt(), userBlockedInfoDto.getUnbannedAt());
	}

	@Test
	void toUserProfileDto() {
		User user = User.of("intraId", "user@email.com", new Date(), UserRole.USER);
		UserProfileDto userProfileDto = userMapper.toUserProfileDto(user);
		assertEquals(user.getUserId(), userProfileDto.getUserId());
		assertEquals(user.getName(), userProfileDto.getName());
	}
}
