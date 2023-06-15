package org.ftclub.cabinet.lent.domain;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.DateUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class LentHistoryUnitTest {

    @Test
    @DisplayName("of() 성공 - 정상입력")
    void of_성공() {
        assertInstanceOf(LentHistory.class, LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L));
    }

    @Test
    @DisplayName("of() 실패 - 대여시작시간 NULL")
    void of_실패_startedAt_NULL() {
        DomainException domainException = assertThrows(DomainException.class, () -> LentHistory.of(
                null,
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L));

        assertEquals(ExceptionStatus.INVALID_ARGUMENT, domainException.getStatus());
    }

    @Test
    @DisplayName("of() 실패 - 만료시간 NULL")
    void of_실패_expiredAt_NULL() {
        DomainException domainException = assertThrows(DomainException.class, () -> LentHistory.of(
                DateUtil.getNow(),
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
                DateUtil.getNow(),
                DateUtil.getInfinityDate(),
                1L,
                1L));
    }

 */

    @Test
    @DisplayName("of() 실패 유저ID NULL")
    void of_실패_userId_NULL() {
        DomainException domainException = assertThrows(DomainException.class, () -> LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                null,
                1L));

        assertEquals(ExceptionStatus.INVALID_ARGUMENT, domainException.getStatus());
    }

    @Test
    @DisplayName("of() 실패 - 사물함ID NULL")
    void of_실패_cabinetId_NULL() {
        DomainException domainException = assertThrows(DomainException.class, () -> LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                null));

        assertEquals(ExceptionStatus.INVALID_ARGUMENT, domainException.getStatus());
    }

    @Test
    @DisplayName("캐비넷 아이디 비교 성공 - ID 동일")
    void isCabinetIdEqual_성공_ID_같음() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        assertTrue(lentHistory.isCabinetIdEqual(1L));
    }

    @Test
    @DisplayName("캐비넷 아이디 비교 실패 - ID 다름")
    void isCabinetIdEqual_실패_ID_다름() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        assertFalse(lentHistory.isCabinetIdEqual(2L));
    }

    @Test
    @DisplayName("만료시간 설정 성공 - 대여일자보다 3일 이후")
    void isSetExpiredAt_성공_3일이후() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        assertTrue(lentHistory.isSetExpiredAt());
    }

//    @Test
//    @DisplayName("만료시간 설정 false - 만료시간 무한")
//    void isSetExpiredAt_실패() {
//        LentHistory lentHistory = LentHistory.of(
//                DateUtil.getNow(),
//                DateUtil.getInfinityDate(),
//                1L,
//                1L);
//
//        assertFalse(lentHistory.isSetExpiredAt());
//    }

    @Test
    @DisplayName("만료일자 설정 성공 - 3일이후만료")
    void isSetEndedAt_성공_3일일후만료() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        lentHistory.endLent(DateUtil.getNow()); // 반납

        assertTrue(lentHistory.isSetEndedAt());
    }

//    @Test
//    @DisplayName("반납시간 설정 실패")
//    void isSetEndedAt_실패_만료시간_무한() {
//        LentHistory lentHistory = LentHistory.of(
//                DateUtil.getNow(),
//                DateUtil.getInfinityDate(),
//                1L,
//                1L);
//
//        assertFalse(lentHistory.isSetEndedAt());
//    }

    @Test
    @DisplayName("남은만료일자-반납일자 성공 - 3일 조기반납")
    void getDaysDiffEndedAndExpired_성공_조기반납() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        lentHistory.endLent(DateUtil.getNow()); // 바로 반납

        assertEquals(-3, lentHistory.getDaysDiffEndedAndExpired());
    }


    @Test
    @DisplayName("남은만료일자-반납일자차이 성공 - 5일 연체반납")
    void getDaysDiffEndedAndExpired_성공_연체반납() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        lentHistory.endLent(DateUtil.addDaysToDate(DateUtil.getNow(), 5)); // 2일 연체 반납

        assertEquals(2, lentHistory.getDaysDiffEndedAndExpired());
    }


    @Test
    @DisplayName("남은만료일자와 반납일자 차이 - 잔여 0일 반납")
    void getDaysDiffEndedAndExpired_성공_정상반납() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.getNow(),
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                1L,
                1L);

        DomainException domainException = assertThrows(DomainException.class,
                () -> lentHistory.endLent(null));
        assertEquals(ExceptionStatus.INVALID_STATUS, domainException.getStatus());
    }

    @Test
    @DisplayName("반납 함수 성공 - 반납일자가 대여일자보다 이후")
    void endLent_성공_대여일자_이후에_반납() {
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
    @DisplayName("반납 함수 실패 - 대여일자가 반납일자보다 이후")
    void endLent_실패_대여일자_이전에_반납() {
        LentHistory lentHistory = LentHistory.of(
                DateUtil.addDaysToDate(DateUtil.getNow(), 3),
                DateUtil.addDaysToDate(DateUtil.getNow(), 5),
                1L,
                1L);

        DomainException domainException = assertThrows(DomainException.class,
                () -> lentHistory.endLent(DateUtil.getNow()));
        assertEquals(ExceptionStatus.INVALID_STATUS, domainException.getStatus());
    }
}
