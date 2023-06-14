package org.ftclub.cabinet.lent.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.utils.DateUtil;
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
		Date now = DateUtil.getNow();
		LentHistory lentHistory = LentHistory.of(now, DateUtil.addDaysToDate(now, 3), 1L, 1L);
		lentHistory.isCabinetIdEqual(1L);
		lentHistory.isCabinetIdEqual(2L);
	}

    @Test
    void isSetExpiredAt() {
        Date now = DateUtil.getNow();
        LentHistory lentHistory = LentHistory.of(now, DateUtil.addDaysToDate(now, 3), 1L, 1L);
        assertTrue(lentHistory.isSetExpiredAt());
        assertThrows(DomainException.class, () -> LentHistory.of(now, null, 1L, 1L));
    }

	@Test
	void isSetEndedAt() {
		Date now = DateUtil.getNow();
		LentHistory lentHistory = LentHistory.of(now, DateUtil.addDaysToDate(now, 3), 1L, 1L);
		assertFalse(lentHistory.isSetEndedAt());
		lentHistory.endLent(DateUtil.getNow());
		assertTrue(lentHistory.isSetEndedAt());
	}

	@Test
	void getDaysDiffEndedAndExpired() {
		Date now = DateUtil.getNow();
		LentHistory lentHistory = LentHistory.of(now, now, 1L, 1L);
		assertNull(lentHistory.getDaysDiffEndedAndExpired());
		lentHistory.endLent(DateUtil.addDaysToDate(now, 3));
		assertEquals(3, lentHistory.getDaysDiffEndedAndExpired());
	}

	@Test
	void endLent() {
		Date now = DateUtil.getNow();
		LentHistory lentHistory = LentHistory.of(now, DateUtil.addDaysToDate(now, 3), 1L, 1L);
		lentHistory = lentRepository.save(lentHistory);
		lentHistory.endLent(DateUtil.addDaysToDate(now, 6));
		assertTrue(lentHistory.isSetEndedAt());
		assertEquals(3, lentHistory.getDaysDiffEndedAndExpired());
		lentRepository.findById(lentHistory.getLentHistoryId());
		assertTrue(lentHistory.isSetEndedAt());
		assertEquals(3, lentHistory.getDaysDiffEndedAndExpired());
	}
}
