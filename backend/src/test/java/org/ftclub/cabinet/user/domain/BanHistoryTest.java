package org.ftclub.cabinet.user.domain;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import org.ftclub.cabinet.exception.DomainException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class BanHistoryTest {

	@Test
	@DisplayName("BanHistory 생성 성공 - ALL 타입")
	void of_성공_ALL_타입() {
		assertDoesNotThrow(() -> BanHistory.of(LocalDateTime.now(), null, BanType.ALL, 1L));
	}

	@Test
	@DisplayName("BanHistory 생성 성공 - SHARE 타입")
	void of_성공_SHARE_타입() {
		assertDoesNotThrow(() -> BanHistory.of(LocalDateTime.now(), null, BanType.SHARE, 2L));
	}

	@Test
	@DisplayName("BanHistory 생성 성공 - NONE 타입")
	void of_성공_NONE_타입() {
		assertDoesNotThrow(() -> BanHistory.of(LocalDateTime.now(), null, BanType.NONE, 3L));
	}

	@Test
	@DisplayName("BanHistory 생성 성공 - PRIVATE 타입")
	void of_성공_PRIVATE_타입() {
		assertDoesNotThrow(() -> BanHistory.of(LocalDateTime.now(), null, BanType.PRIVATE, 4L));
	}

	@Test
	@DisplayName("BanHistory 생성 실패 - 밴 시점 null")
	void of_실패_밴_시점_null() {
		assertThrows(DomainException.class,
				() -> BanHistory.of(null, null, BanType.ALL, 1L));
	}

	@Test
	@DisplayName("BanHistory 생성 실패 - 밴 타입 null")
	void of_실패_밴_타입_null() {
		assertThrows(DomainException.class,
				() -> BanHistory.of(LocalDateTime.now(), null, null, 2L));
	}

	@Test
	@DisplayName("BanHistory 생성 실패 - 유저 아이디 null")
	void of_실패_유저_아이디_null할() {
		assertThrows(DomainException.class,
				() -> BanHistory.of(LocalDateTime.now(), null, BanType.PRIVATE, null));
	}

	@Test
	@DisplayName("밴 여부 확인 성공 - 밴 중")
	void isBanEndedBefore_성공_밴중() {
		LocalDateTime now = LocalDateTime.now();
		BanHistory banHistory = BanHistory.of(now, now.plusHours(3), BanType.ALL, 1L);

		assertTrue(banHistory.isBanEndedBefore(now.plusHours(2)));
	}

	@Test
	@DisplayName("밴 여부 확인 성공 - 밴 종료")
	void isBanEndedBefore_성공_밴종료() {
		LocalDateTime now = LocalDateTime.now();
		BanHistory banHistory = BanHistory.of(now, now.plusHours(3), BanType.ALL, 1L);

		assertFalse(banHistory.isBanEndedBefore(now.plusHours(4)));
	}
}
