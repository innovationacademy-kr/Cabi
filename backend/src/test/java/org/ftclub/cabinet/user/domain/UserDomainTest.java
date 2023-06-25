package org.ftclub.cabinet.user.domain;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.utils.DateUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

// TODO: 나중에 통과하는 코드로 변경되면 @Disabled 제거
@Disabled("나중에 제거 필")
public class UserDomainTest {

	@Test
	void AdminUser_생성_성공() {
		assertDoesNotThrow(() -> AdminUser.of("test-test@test.com", AdminRole.NONE));
		assertDoesNotThrow(() -> AdminUser.of("test.test_123@test.com", AdminRole.ADMIN));
		assertDoesNotThrow(() -> AdminUser.of("test@student.42seoul.kr", AdminRole.MASTER));
	}

	@Test
	void AdminUser_생성_실패() {
		assertThrows(DomainException.class, () -> AdminUser.of("test@test", AdminRole.NONE));
		assertThrows(DomainException.class, () -> AdminUser.of("!test@test.com", AdminRole.ADMIN));
		assertThrows(DomainException.class, () -> AdminUser.of("test@test.com", null));
		assertThrows(DomainException.class, () -> AdminUser.of(null, AdminRole.MASTER));
	}

	@Test
	void AdminUser_Role_변경() {
		AdminUser adminUser = AdminUser.of("test@test.com", AdminRole.NONE);

		assertDoesNotThrow(() -> adminUser.changeAdminRole(AdminRole.ADMIN));
		assertDoesNotThrow(() -> adminUser.changeAdminRole(AdminRole.MASTER));
		assertThrows(DomainException.class, () -> adminUser.changeAdminRole(null));
	}

	@Test
	void BanHistory_생성_성공() {
		assertDoesNotThrow(() -> BanHistory.of(DateUtil.getNow(), null, BanType.ALL, 1L));
		assertDoesNotThrow(() -> BanHistory.of(DateUtil.getNow(), null, BanType.SHARE, 2L));
		assertDoesNotThrow(() -> BanHistory.of(DateUtil.getNow(), null, BanType.NONE, 3L));
		assertDoesNotThrow(() -> BanHistory.of(DateUtil.getNow(), null, BanType.PRIVATE, 4L));
	}

	@Test
	void BanHistory_생성_실패() {
		assertThrows(DomainException.class,
				() -> BanHistory.of(null, null, BanType.ALL, 1L));
		assertThrows(DomainException.class,
				() -> BanHistory.of(DateUtil.getNow(), null, null, 2L));
		assertThrows(DomainException.class,
				() -> BanHistory.of(DateUtil.getNow(), null, BanType.PRIVATE, null));
	}

	@Test
	void User_생성_성공() {
		assertDoesNotThrow(() ->
				User.of("test1", "test-test@test.com", null, UserRole.USER));
		assertDoesNotThrow(() ->
				User.of("test2", "test.test_123@test.com", null, UserRole.CLUB));
		assertDoesNotThrow(() ->
				User.of("test3", "test@student.42seoul.kr", null, UserRole.USER));
	}

	@Test
	void User_생성_실패() {
		assertThrows(DomainException.class,
				() -> User.of(null, "test@test.com", null, UserRole.USER));
		assertThrows(DomainException.class,
				() -> User.of("test1", "test@test", null, UserRole.USER));
		assertThrows(DomainException.class,
				() -> User.of("test2", "!test@test.com", null, UserRole.CLUB));
		assertThrows(DomainException.class,
				() -> User.of("test3", null, null, UserRole.CLUB));
		assertThrows(DomainException.class,
				() -> User.of("test4", "test@test.com", null, null));
	}
}
