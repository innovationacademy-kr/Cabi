package org.ftclub.cabinet.user.domain;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.ftclub.cabinet.exception.DomainException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class AdminUserTest {

	@Test
	@DisplayName("어드민 유저 생성 성공 - 일반적인 이메일 형식")
	void of_성공_일반적인_이메일_형식() {
		assertDoesNotThrow(() -> AdminUser.of("test-test@test.com", AdminRole.NONE));
	}

	@Test
	@DisplayName("어드민 유저 생성 성공 - 아이디에 점과 하이픈이 들어간 이메일 형식")
	void of_성공_아이디에_점과_하이픈_이메일_형식() {
		assertDoesNotThrow(() -> AdminUser.of("test.test_123@test.com", AdminRole.ADMIN));
	}

	@Test
	@DisplayName("어드민 유저 생성 성공 - 점이 두 개 들어간 이메일 형식")
	void of_성공_점_두개_이메일_형식() {
		assertDoesNotThrow(() -> AdminUser.of("test@student.42seoul.kr", AdminRole.MASTER));
	}

	@Test
	@DisplayName("어드민 유저 생성 실패 - 잘못된 이메일 형식")
	void of_실패_잘못된_이메일_형식() {
		assertThrows(DomainException.class, () -> AdminUser.of("test@test", AdminRole.NONE));
	}

	@Test
	@DisplayName("어드민 유저 생성 실패 - 이메일 비허용 특수문자 포함")
	void of_실패_이메일_비허용_특수문자_포함() {
		assertThrows(DomainException.class, () -> AdminUser.of("!test@test.com", AdminRole.ADMIN));
	}

	@Test
	@DisplayName("어드민 유저 생성 실패 - 이메일 null")
	void of_실패_이메일_null() {
		assertThrows(DomainException.class, () -> AdminUser.of(null, AdminRole.MASTER));
	}

	@Test
	@DisplayName("어드민 유저 생성 실패 - 어드민 권한 null")
	void of_실패_어드민_권한_null() {
		assertThrows(DomainException.class, () -> AdminUser.of("test@test.com", null));
	}

	@Test
	@DisplayName("어드민 유저 권한 변경 성공 - 어드민 권한 부여")
	void changeAdminRole_성공_어드민권한_부여() {
		AdminUser adminUser = AdminUser.of("test@test.com", AdminRole.NONE);
		assertDoesNotThrow(() -> adminUser.changeAdminRole(AdminRole.ADMIN));
	}

	@Test
	@DisplayName("어드민 유저 권한 변경 성공 - 최고 권한 부여")
	void changeAdminRole_성공_최고권한_부여() {
		AdminUser adminUser = AdminUser.of("test@test.com", AdminRole.ADMIN);
		assertDoesNotThrow(() -> adminUser.changeAdminRole(AdminRole.MASTER));
	}

	@Test
	@DisplayName("어드민 유저 권한 변경 실패 - 권한 null로 변경")
	void changeAdminRole_실패_권한_null() {
		AdminUser adminUser = AdminUser.of("test@test.com", AdminRole.NONE);
		assertThrows(DomainException.class, () -> adminUser.changeAdminRole(null));
	}

}
