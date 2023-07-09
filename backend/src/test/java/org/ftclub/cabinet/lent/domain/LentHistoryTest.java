package org.ftclub.cabinet.lent.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class LentHistoryTest {

	@Autowired
	LentRepository lentRepository;

	@Test
	void isCabinetIdEqual() {
		LocalDateTime now = LocalDateTime.now();
		LentHistory lentHistory = LentHistory.of(now, now.plusDays(3), 1L, 1L);
		assertTrue(lentHistory.isCabinetIdEqual(1L));
		assertFalse(lentHistory.isCabinetIdEqual(2L));
	}

	@Test
	void isSetExpiredAt() {
		LocalDateTime now = LocalDateTime.now();
		LentHistory lentHistory = LentHistory.of(now, now.plusDays(3), 1L, 1L);
		assertTrue(lentHistory.isSetExpiredAt());
		assertThrows(DomainException.class, () -> LentHistory.of(now, null, 1L, 1L));
	}

	@Test
	void isSetEndedAt() {
		LocalDateTime now = LocalDateTime.now();
		LentHistory lentHistory = LentHistory.of(now, now.plusDays(3), 1L, 1L);
		assertFalse(lentHistory.isSetEndedAt());
		lentHistory.endLent(LocalDateTime.now());
		assertTrue(lentHistory.isSetEndedAt());
	}

	@Test
	void getDaysDiffEndedAndExpired() {
		LocalDateTime now = LocalDateTime.now();
		LentHistory lentHistory = LentHistory.of(now, now, 1L, 1L);
		assertNull(lentHistory.getDaysDiffEndedAndExpired());
		lentHistory.endLent(now.plusDays(3));
		assertEquals(3, lentHistory.getDaysDiffEndedAndExpired());
	}

	@Test
	void isExpired() {
		LocalDateTime now = LocalDateTime.now();
		LentHistory lentHistory = LentHistory.of(now, now.plusDays(3), 1L, 1L);
		assertFalse(lentHistory.isExpired(now));
		lentHistory.endLent(now.plusDays(6));
		assertTrue(lentHistory.isExpired(now.plusDays(6)));
	}

	@Test
	void getDaysUntilExpiration() {
		LocalDateTime now = LocalDateTime.now();
		LentHistory lentHistory = LentHistory.of(now, now.plusDays(3), 1L, 1L);
		assertEquals(-3, lentHistory.getDaysUntilExpiration(now));
		assertEquals(3, lentHistory.getDaysUntilExpiration(now.plusDays(6)));
	}

	@Test
	void endLent() {
		LocalDateTime now = LocalDateTime.now();
		LentHistory lentHistory = LentHistory.of(now, now.plusDays(3), 1L, 1L);
		lentHistory = lentRepository.save(lentHistory);
		lentHistory.endLent(now.plusDays(6));
		assertTrue(lentHistory.isSetEndedAt());
		assertEquals(3, lentHistory.getDaysDiffEndedAndExpired());
		lentRepository.findById(lentHistory.getLentHistoryId());
		assertTrue(lentHistory.isSetEndedAt());
		assertEquals(3, lentHistory.getDaysDiffEndedAndExpired());
	}
}
