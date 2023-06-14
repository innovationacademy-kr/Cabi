package org.ftclub.cabinet.lent.domain;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.utils.DateUtil;
import org.junit.jupiter.api.Test;

class LentHistoryUnitTest {

    @Test
    void isValid_Success() {
        assertInstanceOf(LentHistory.class, LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L));
    }

    @Test
    void isValid_FAILURE_startedAt_NULL() {
        assertThrows(DomainException.class, () -> LentHistory.of(
                null,
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L));
    }

    @Test
    void isValid_FAILURE_expiredAt_NULL() {
        assertThrows(DomainException.class, () -> LentHistory.of(
                DateUtil.getNow(),
                null,
                1L,
                1L));
    }
/*
//TODO Expired Date infinity 가능하게 갈건지?? 06.14 wchae
    @Test
    void isValid_FAILURE_expiredAt_INFINITY() {
        assertThrows(DomainException.class, () -> LentHistory.of(
                DateUtil.getNow(),
                DateUtil.getInfinityDate(),
                1L,
                1L));
    }

 */

    @Test
    void isValid_FAILURE_userId_NULL() {
        assertThrows(DomainException.class, () -> LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                null,
                1L));
    }

    @Test
    void isValid_FAILURE_cabinetId_NULL() {
        assertThrows(DomainException.class, () -> LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                null));
    }

    @Test
    void isCabinetIdEqual_SUCCESS() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        assertTrue(lentHistory.isCabinetIdEqual(1L));
    }

    @Test
    void isCabinetIdEqual_FAILURE() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        assertFalse(lentHistory.isCabinetIdEqual(2L));
    }

    @Test
    void isSetExpiredAt_SUCCESS() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        assertTrue(lentHistory.isSetExpiredAt());
    }

    @Test
    void isSetExpiredAt_Failure() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.getInfinityDate(),
                1L,
                1L);

        assertFalse(lentHistory.isSetExpiredAt());
    }

    @Test
    void isSetEndedAt_TRUE_SUCCESS() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        lentHistory.endLent(DateUtil.getNow()); // 반납

        assertTrue(lentHistory.isSetEndedAt());
    }

    @Test
    void isSetEndedAt_FAILURE() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.getInfinityDate(),
                1L,
                1L);

        assertFalse(lentHistory.isSetEndedAt());
    }

    @Test
    void getDaysDiffEndedAndExpired_PRE_RETURN() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        lentHistory.endLent(DateUtil.getNow()); // 바로 반납

        assertEquals(lentHistory.getDaysDiffEndedAndExpired(), -3);
    }


    @Test
    void getDaysDiffEndedAndExpired_DELAYED_RETURN() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        lentHistory.endLent(DateUtil.addDaysToDate(DateUtil.getNow(), 5)); // 2일 연체 반납

        assertEquals(lentHistory.getDaysDiffEndedAndExpired(), 2);
    }


    @Test
    void getDaysDiffEndedAndExpired_PROPER_RETURN() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        lentHistory.endLent(DateUtil.addDaysToDate(DateUtil.getNow(), 3)); // 2일 연체 반납

        assertEquals(lentHistory.getDaysDiffEndedAndExpired(), 0);
    }

    @Test
    void getDaysDiffEndedAndExpired_FAILURE() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        assertThrows(DomainException.class, () -> lentHistory.endLent(null));
    }

    @Test
    void endLent_SUCCESS() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.getNow(),
                1L,
                1L);

        lentHistory.endLent(DateUtil.getNow());

        assertTrue(lentHistory.isSetEndedAt());
        assertEquals(0, lentHistory.getDaysDiffEndedAndExpired());
    }

    @Test
    void endLent_FAILURE_startDate_BIGGER_THEN_endDate() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                DateUtil.addDaysToDate(DateUtil.getNow(), 5),
                1L,
                1L);

        assertThrows(DomainException.class, () -> lentHistory.endLent(DateUtil.getNow()));
    }

}
