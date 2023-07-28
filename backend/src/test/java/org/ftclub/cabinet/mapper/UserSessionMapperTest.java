package org.ftclub.cabinet.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
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
	void toUserBlockedInfoDto() throws Exception {
		LocalDateTime now = LocalDateTime.now();
		User user = mock(User.class);
		when(user.getUserId()).thenReturn(3L);
		when(user.getName()).thenReturn("intraId");
		when(user.getEmail()).thenReturn("email@test.com");
		when(user.getBlackholedAt()).thenReturn(now);
 		when(user.getRole()).thenReturn(UserRole.USER);
		BanHistory banHistory = BanHistory.of(now, now, BanType.PRIVATE, 3L);
		UserBlockedInfoDto userBlockedInfoDto = userMapper.toUserBlockedInfoDto(banHistory, user);
		assertEquals(banHistory.getUserId(), userBlockedInfoDto.getUserId());
		assertEquals(user.getName(), userBlockedInfoDto.getName());
		assertEquals(banHistory.getBannedAt(), userBlockedInfoDto.getBannedAt());
		assertEquals(banHistory.getUnbannedAt(), userBlockedInfoDto.getUnbannedAt());
	}

	@Test
	void toUserProfileDto() {
		User user = User.of("intraId", "user@email.com", LocalDateTime.now(), UserRole.USER);
		UserProfileDto userProfileDto = userMapper.toUserProfileDto(user);
		assertEquals(user.getUserId(), userProfileDto.getUserId());
		assertEquals(user.getName(), userProfileDto.getName());
	}
}
