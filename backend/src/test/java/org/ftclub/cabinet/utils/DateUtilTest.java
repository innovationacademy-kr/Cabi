package org.ftclub.cabinet.utils;

import org.junit.jupiter.api.Test;

import java.util.Calendar;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class DateUtilTest {
    @Test
    public void 평범한_날_차이_계산() {
        Calendar cal = Calendar.getInstance();
        cal.set(1999, Calendar.JANUARY, 1);
        Date day1 = cal.getTime();
        cal.set(1999, Calendar.JANUARY, 3);
        Date day2 = cal.getTime();
        assertEquals(DateUtil.calculateTwoDateDiffAbs(day1, day2), 2);
        assertEquals(DateUtil.calculateTwoDateDiffAbs(day2, day1), 2);
    }

    @Test
    public void 세심한_날_차이_계산() {
        Calendar cal = Calendar.getInstance();
        cal.set(1999, Calendar.JANUARY, 1, 12,12,12);
        Date day1 = cal.getTime();
        cal.set(1999, Calendar.JANUARY, 3,12,12,12);
        Date day2 = cal.getTime();
        assertEquals(DateUtil.calculateTwoDateDiffAbs(day1, day2), 2);
        assertEquals(DateUtil.calculateTwoDateDiffAbs(day2, day1), 2);
    }
    @Test
    public void 일초차이_차이_계산() {
        Calendar cal = Calendar.getInstance();
        cal.set(1999, Calendar.JANUARY, 1, 12,12,13);
        Date day1 = cal.getTime();
        cal.set(1999, Calendar.JANUARY, 3,12,12,12);
        Date day2 = cal.getTime();
        assertEquals(DateUtil.calculateTwoDateDiffAbs(day1, day2), 1);
        assertEquals(DateUtil.calculateTwoDateDiffAbs(day2, day1), 1);
    }

    @Test
    public void 날짜_더하기() {
        Calendar cal = Calendar.getInstance();
        cal.set(1999, Calendar.JANUARY, 1);
        Date tar = cal.getTime();
        cal.set(1999, Calendar.JANUARY, 4);
        Date rst = cal.getTime();
        assertEquals(DateUtil.addDaysToDate(tar, 3), rst);
    }

    @Test
    public void 날짜_큰수_더하기() {
        Calendar cal = Calendar.getInstance();
        cal.set(1999, Calendar.JANUARY, 1);
        Date tar = cal.getTime();
        cal.set(1999, Calendar.FEBRUARY, 1);
        Date rst = cal.getTime();
        assertEquals(DateUtil.addDaysToDate(tar, 31), rst);
    }

    @Test
    public void 날짜_더하기_잘못된_값() {
        Calendar cal = Calendar.getInstance();
        cal.set(1999, Calendar.JANUARY, 1);
        Date tar = cal.getTime();
        cal.set(1998, Calendar.DECEMBER, 31);
        Date rst = cal.getTime();
        assertEquals(DateUtil.addDaysToDate(tar, -1), rst);
    }
}