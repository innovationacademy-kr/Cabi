package org.ftclub.cabinet.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserSessionMapperTest {

	@Autowired
	UserMapper userMapper;

	@Test
	void toUserBlockedInfoDto() throws Exception {
//		LocalDateTime now = LocalDateTime.now();
//		User user = mock(User.class);
//		when(user.getId()).thenReturn(3L);
//		when(user.getName()).thenReturn("intraId");
//		when(user.getEmail()).thenReturn("email@test.com");
//		when(user.getBlackholedAt()).thenReturn(now);
//		when(user.getRole()).thenReturn(UserRole.USER);
//		BanHistory banHistory = BanHistory.of(now, now, BanType.PRIVATE, 3L);
//		UserBlockedInfoDto userBlockedInfoDto = userMapper.toUserBlockedInfoDto(banHistory, user);
//		assertEquals(banHistory.getUserId(), userBlockedInfoDto.getUserId());
//		assertEquals(user.getName(), userBlockedInfoDto.getName());
//		assertEquals(banHistory.getBannedAt(), userBlockedInfoDto.getBannedAt());
//		assertEquals(banHistory.getUnbannedAt(), userBlockedInfoDto.getUnbannedAt());
	}

	@Test
	void toUserProfileDto() {
//		User user = User.of("intraId", "user@email.com", LocalDateTime.now(), UserRole.USER);
//		UserProfileDto userProfileDto = userMapper.toUserProfileDto(user);
//		assertEquals(user.getId(), userProfileDto.getUserId());
//		assertEquals(user.getName(), userProfileDto.getName());
	}
}
