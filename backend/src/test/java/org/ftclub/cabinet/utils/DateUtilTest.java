package org.ftclub.cabinet.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Calendar;
import java.util.Date;
import org.junit.jupiter.api.Test;

class DateUtilTest {

	@Test
	public void 평범한_날_절댓값_차이_계산() {
		Calendar cal = Calendar.getInstance();
		cal.set(1999, Calendar.JANUARY, 1);
		Date day1 = cal.getTime();
		cal.set(1999, Calendar.JANUARY, 3);
		Date day2 = cal.getTime();
		assertEquals(2, DateUtil.calculateTwoDateDiffAbs(day1, day2));
		assertEquals(2, DateUtil.calculateTwoDateDiffAbs(day2, day1));
	}

	@Test
	public void 세심한_날_절댓값_차이_계산() {
		Calendar cal = Calendar.getInstance();
		cal.set(1999, Calendar.JANUARY, 1, 12, 12, 12);
		Date day1 = cal.getTime();
		cal.set(1999, Calendar.JANUARY, 3, 12, 12, 12);
		Date day2 = cal.getTime();
		assertEquals(2, DateUtil.calculateTwoDateDiffAbs(day1, day2));
		assertEquals(2, DateUtil.calculateTwoDateDiffAbs(day2, day1));
	}

	@Test
	public void 일초차이_절댓값_계산() {
		Calendar cal = Calendar.getInstance();
		cal.set(1999, Calendar.JANUARY, 1, 12, 12, 13);
		Date day1 = cal.getTime();
		cal.set(1999, Calendar.JANUARY, 3, 12, 12, 12);
		Date day2 = cal.getTime();
		assertEquals(1, DateUtil.calculateTwoDateDiffAbs(day1, day2));
		assertEquals(1, DateUtil.calculateTwoDateDiffAbs(day2, day1));
	}

	@Test
	public void 평범한_날_차이_계산() {
		Calendar cal = Calendar.getInstance();
		cal.set(1999, Calendar.JANUARY, 1);
		Date day1 = cal.getTime();
		cal.set(1999, Calendar.JANUARY, 3);
		Date day2 = cal.getTime();
		assertEquals(-2, DateUtil.calculateTwoDateDiff(day1, day2));
		assertEquals(2, DateUtil.calculateTwoDateDiff(day2, day1));
	}

	@Test
	public void 세심한_날_차이_계산() {
		Calendar cal = Calendar.getInstance();
		cal.set(1999, Calendar.JANUARY, 1, 12, 12, 12);
		Date day1 = cal.getTime();
		cal.set(1999, Calendar.JANUARY, 3, 12, 12, 12);
		Date day2 = cal.getTime();
		assertEquals(-2, DateUtil.calculateTwoDateDiff(day1, day2));
		assertEquals(2, DateUtil.calculateTwoDateDiff(day2, day1));
	}

	@Test
	public void 일초차이_계산() {
		Calendar cal = Calendar.getInstance();
		cal.set(1999, Calendar.JANUARY, 1, 12, 12, 13);
		Date day1 = cal.getTime();
		cal.set(1999, Calendar.JANUARY, 3, 12, 12, 12);
		Date day2 = cal.getTime();
		assertEquals(-1, DateUtil.calculateTwoDateDiff(day1, day2));
		assertEquals(1, DateUtil.calculateTwoDateDiff(day2, day1));
	}

	@Test
	public void 날짜_더하기() {
		Calendar cal = Calendar.getInstance();
		cal.set(1999, Calendar.JANUARY, 1);
		Date tar = cal.getTime();
		cal.set(1999, Calendar.JANUARY, 4);
		Date rst = cal.getTime();
		assertEquals(rst, DateUtil.addDaysToDate(tar, 3));
	}

	@Test
	public void 날짜_큰수_더하기() {
		Calendar cal = Calendar.getInstance();
		cal.set(1999, Calendar.JANUARY, 1);
		Date tar = cal.getTime();
		cal.set(1999, Calendar.FEBRUARY, 1);
		Date rst = cal.getTime();
		assertEquals(rst, DateUtil.addDaysToDate(tar, 31));
	}

	@Test
	public void 날짜_더하기_잘못된_값() {
		Calendar cal = Calendar.getInstance();
		cal.set(1999, Calendar.JANUARY, 1);
		Date tar = cal.getTime();
		cal.set(1998, Calendar.DECEMBER, 31);
		Date rst = cal.getTime();
		assertEquals(rst, DateUtil.addDaysToDate(tar, -1));
	}
}