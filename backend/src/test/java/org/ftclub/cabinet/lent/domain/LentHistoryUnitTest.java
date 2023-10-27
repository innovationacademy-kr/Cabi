package org.ftclub.cabinet.lent.domain;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.DateUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class LentHistoryUnitTest {

	@Test
	@DisplayName("성공 : of() - 정상입력")
	void of_성공() {
		assertInstanceOf(LentHistory.class, LentHistory.of(
				LocalDateTime.now(),
				LocalDateTime.now().plusDays(3),
				1L,
				1L));
	}

	@Test
	@DisplayName("실패 : of() - 대여시작시간 NULL")
	void of_실패_startedAt_NULL() {
		DomainException domainException = assertThrows(DomainException.class, () -> LentHistory.of(
				null,
				LocalDateTime.now().plusDays(3),
				1L,
				1L));

		assertEquals(ExceptionStatus.INVALID_ARGUMENT, domainException.getStatus());
	}

	@Test
	@DisplayName("실패 : of() - 만료시간 NULL")
	void of_실패_expiredAt_NULL() {
		DomainException domainException = assertThrows(DomainException.class, () -> LentHistory.of(
				LocalDateTime.now(),
				null,
				1L,
				1L));

		assertEquals(ExceptionStatus.INVALID_ARGUMENT, domainException.getStatus());
	}
/*
//TODO Expired Date infinity 가능하게 갈건지?? 06.14 wchae
    @Test
    void isValid_FAILURE_expiredAt_INFINITY() {
        assertThrows(DomainException.class, () -> LentHistory.of(
                LocalDateTime.now(),
                DateUtil.getInfinityDate(),
                1L,
                1L));
    }

 */

	@Test
	@DisplayName("실패: of() - 유저ID NULL")
	void of_실패_userId_NULL() {
		DomainException domainException = assertThrows(DomainException.class, () -> LentHistory.of(
				LocalDateTime.now(),
				LocalDateTime.now().plusDays(3),
				null,
				1L));

		assertEquals(ExceptionStatus.INVALID_ARGUMENT, domainException.getStatus());
	}

	@Test
	@DisplayName("실패: of() - 사물함ID NULL")
	void of_실패_cabinetId_NULL() {
		DomainException domainException = assertThrows(DomainException.class, () -> LentHistory.of(
				LocalDateTime.now(),
				LocalDateTime.now().plusDays(3),
				1L,
				null));

		assertEquals(ExceptionStatus.INVALID_ARGUMENT, domainException.getStatus());
	}

	@Test
	@DisplayName("성공: 캐비넷 아이디 비교 - ID 동일")
	void isCabinetIdEqual_성공_ID_같음() {
		LentHistory lentHistory = LentHistory.of(
				LocalDateTime.now(),
				LocalDateTime.now().plusDays(3),
				1L,
				1L);

		assertTrue(lentHistory.isCabinetIdEqual(1L));
	}

	@Test
	@DisplayName("실패: 캐비넷 아이디 비교 - ID 다름")
	void isCabinetIdEqual_실패_ID_다름() {
		LentHistory lentHistory = LentHistory.of(
				LocalDateTime.now(),
				LocalDateTime.now().plusDays(3),
				1L,
				1L);

		assertFalse(lentHistory.isCabinetIdEqual(2L));
	}

	@Test
	@DisplayName("성공: 만료시간 설정 - 대여일자보다 3일 이후")
	void isSetExpiredAt_성공_3일이후() {
		LentHistory lentHistory = LentHistory.of(
				LocalDateTime.now(),
				LocalDateTime.now().plusDays(3),
				1L,
				1L);

		assertTrue(lentHistory.isSetExpiredAt());
	}


	@Test
	@DisplayName("성공: 만료일자 설정 - 3일이후만료")
	void isSetEndedAt_성공_3일일후만료() {
		LentHistory lentHistory = LentHistory.of(
				LocalDateTime.now(),
				LocalDateTime.now().plusDays(3),
				1L,
				1L);

		lentHistory.endLent(LocalDateTime.now()); // 반납

		assertTrue(lentHistory.isSetEndedAt());
	}


	@Test
	@DisplayName("성공: 남은만료일자-반납일자 - 3일 조기반납")
	void getDaysDiffEndedAndExpired_성공_조기반납() {
		LentHistory lentHistory = LentHistory.of(
				LocalDateTime.now(),
				LocalDateTime.now().plusDays(3),
				1L,
				1L);

		lentHistory.endLent(LocalDateTime.now()); // 바로 반납

		assertEquals(-3, lentHistory.getDaysDiffEndedAndExpired());
	}


	@Test
	@DisplayName("남은만료일자-반납일자차이 성공 - 5일 연체반납")
	void getDaysDiffEndedAndExpired_성공_연체반납() {
		LentHistory lentHistory = LentHistory.of(
				LocalDateTime.now(),
				LocalDateTime.now().plusDays(3),
				1L,
				1L);

		lentHistory.endLent(LocalDateTime.now().plusDays(5)); // 2일 연체 반납

		assertEquals(3, lentHistory.getDaysDiffEndedAndExpired());
	}


	@Test
	@DisplayName("성공: 남은만료일자와 반납일자 차이 - 잔여 0일 반납")
	void getDaysDiffEndedAndExpired_성공_정상반납() {
		LentHistory lentHistory = LentHistory.of(
				LocalDateTime.now(),
				LocalDateTime.now().plusDays(3),
				1L,
				1L);

		DomainException domainException = assertThrows(DomainException.class,
				() -> lentHistory.endLent(null));
		assertEquals(ExceptionStatus.INVALID_ARGUMENT, domainException.getStatus());
	}

	@Test
	@DisplayName("성공: 반납 함수 - 반납일자가 대여일자보다 이후")
	void endLent_성공_대여일자_이후에_반납() {
		LentHistory lentHistory = LentHistory.of(
				LocalDateTime.now(),
				LocalDateTime.now(),
				1L,
				1L);

		lentHistory.endLent(LocalDateTime.now().plusDays(1));

		assertTrue(lentHistory.isSetEndedAt());
		assertTrue(0 < lentHistory.getDaysDiffEndedAndExpired());
	}

	@Test
	@DisplayName("실패: 반납 함수 - 대여일자가 반납일자보다 이후")
	void endLent_실패_대여일자_이전에_반납() {
		LentHistory lentHistory = LentHistory.of(
				LocalDateTime.now().plusDays(3),
				LocalDateTime.now().plusDays(5),
				1L,
				1L);

		DomainException domainException = assertThrows(DomainException.class,
				() -> lentHistory.endLent(LocalDateTime.now()));
		assertEquals(ExceptionStatus.INVALID_ARGUMENT, domainException.getStatus());
	}

	@Test
	@DisplayName("연체 학인 실패 - 만료일자가 설정되지 않음")
	void isExpired_실패_만료일자_미설정() {
		LocalDateTime now = LocalDateTime.now();
		LentHistory lentHistory = LentHistory.of(
				now,
				DateUtil.getInfinityDate(),
				1L,
				1L);

		assertEquals(false, lentHistory.isExpired(now));
	}

	@Test
	@DisplayName("연체 일수 계산 실패 - 만료일자가 설정되지 않음")
	void getDaysUntilExpiration_실패_만료일자_미설정() {
		LentHistory lentHistory = LentHistory.of(
				LocalDateTime.now(),
				DateUtil.getInfinityDate(),
				1L,
				1L);

		assertEquals(null, lentHistory.getDaysDiffEndedAndExpired());
	}
}
