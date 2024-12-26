package org.ftclub.cabinet.user.domain;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

@RequiredArgsConstructor
public class UserTest {

	@Test
	void isSameBlackholedAt_test_both_null() {
		User test = User.of("test", "aewf@naver.com", null);
		boolean sameBlackholedAt = test.isSameBlackholedAt(null);
		Assertions.assertTrue(sameBlackholedAt);
	}

	@Test
	void isSameBlackholedAt_test_one_null() {
		User test = User.of("test", "aewf@naver.com", null);
		boolean sameBlackholedAt = test.isSameBlackholedAt(LocalDateTime.now());
		Assertions.assertFalse(sameBlackholedAt);
	}

	@Test
	void isSameBlackholedAt_test_same() {
		LocalDateTime now = LocalDateTime.now();
		User test = User.of("test", "aewf@naver.com", now);
		boolean sameBlackholedAt = test.isSameBlackholedAt(now);
		Assertions.assertTrue(sameBlackholedAt);
	}

//	@Test
//	@DisplayName("유저 생성 성공 - 일반적인 이메일 형식")
//	void of_성공_일반적인_이메일_형식() {
////		assertDoesNotThrow(() ->
////				User.of("test1", "test-test@test.com", null, UserRole.USER));
//	}
//
//	@Test
//	@DisplayName("유저 생성 성공 - 아이디에 점과 하이픈이 들어간 이메일 형식")
//	void of_성공_아이디에_점과_하이픈_이메일_형식() {
////		assertDoesNotThrow(() ->
////				User.of("test2", "test.test_123@test.com", null, UserRole.CLUB));
//	}
//
//	@Test
//	@DisplayName("유저 생성 성공 - 점이 두 개 들어간 이메일 형식")
//	void of_성공_점_두개_이메일_형식() {
//		assertDoesNotThrow(() ->
//				User.of("test3", "test@student.42seoul.kr", null, UserRole.USER));
//	}
//
//	@Test
//	@DisplayName("유저 생성 실패 - 유저 이름 null")
//	void of_실패_유저_이름_null() {
//		assertThrows(DomainException.class,
//				() -> User.of(null, "test@test.com", null, UserRole.USER));
//	}
//
//	@Test
//	@DisplayName("유저 생성 실패 - 잘못된 이메일 형식")
//	void of_실패_잘못된_이메일_형식() {
//		assertThrows(DomainException.class,
//				() -> User.of("test1", "test@test", null, UserRole.USER));
//	}
//
//	@Test
//	@DisplayName("유저 생성 실패 - 이메일 비허용 특수문자 포함")
//	void of_실패_이메일_비허용_특수문자_포함() {
//		assertThrows(DomainException.class,
//				() -> User.of("test2", "!test@test.com", null, UserRole.CLUB));
//	}
//
//	@Test
//	@DisplayName("유저 생성 실패 - 이메일 null")
//	void of_실패_이메일_null() {
//		assertThrows(DomainException.class,
//				() -> User.of("test3", null, null, UserRole.CLUB));
//	}
//
//	@Test
//	@DisplayName("유저 생성 실패 - 유저 역할 null")
//	void of_실패_유저_role_null() {
//		assertThrows(DomainException.class,
//				() -> User.of("test4", "test@test.com", null, null));
//	}
//
//	@Test
//	@DisplayName("유저 역할 확인 성공 - 일반 유저")
//	void isUserRole_성공_일반유저() {
//		User user = User.of("test", "test@test.com", null, UserRole.USER);
//
//		assertTrue(user.isUserRole(UserRole.USER));
//		assertFalse(user.isUserRole(UserRole.CLUB));
//	}
//
//	@Test
//	@DisplayName("유저 역할 확인 성공 - 동아리")
//	void isUserRole_성공_동아리() {
//		User user = User.of("test", "test@test.com", null, UserRole.CLUB);
//
//		assertFalse(user.isUserRole(UserRole.USER));
//		assertTrue(user.isUserRole(UserRole.CLUB));
//	}
//
//	@Test
//	@DisplayName("유저 블랙홀 날짜 변경 성공 - 블랙홀 날짜 변경")
//	void changeBlackholedAt_성공() {
//		LocalDateTime blackholedAt = LocalDateTime.now().plusDays(10);
//		LocalDateTime changedBlackholedAt = LocalDateTime.now().plusDays(20);
//		User user = User.of("test", "test@test.com", blackholedAt, UserRole.CLUB);
//		user.changeBlackholedAt(changedBlackholedAt);
//
//		assertNotEquals(blackholedAt, user.getBlackholedAt());
//		assertEquals(changedBlackholedAt, user.getBlackholedAt());
//	}
//
//	@Test
//	@DisplayName("유저 삭제 날짜 변경 성공 - 삭제 날짜 변경")
//	void setDeletedAt_성공() {
//	    LocalDateTime deletedAt = LocalDateTime.now().plusDays(10);
//		User user = User.of("test", "test@test.com", null, UserRole.CLUB);
//		user.setDeletedAt(deletedAt);
//
//		assertNotEquals(null, user.getDeletedAt());
//		assertEquals(deletedAt, user.getDeletedAt());
//	}
}
