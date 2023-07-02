package org.ftclub.cabinet.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class DateUtilTest {

	@Test
	public void 평범한_날_절댓값_차이_계산() {
		LocalDateTime day1 = LocalDateTime.of(1999, 1, 1, 0, 0, 0);
		LocalDateTime day2 = LocalDateTime.of(1999, 1, 3, 0, 0, 0);
		assertEquals(2, DateUtil.calculateTwoDateDiffAbs(day1, day2));
		assertEquals(2, DateUtil.calculateTwoDateDiffAbs(day2, day1));
	}

	@Test
	public void 세심한_날_절댓값_차이_계산() {
		LocalDateTime day1 = LocalDateTime.of(1999, 1, 1, 12, 12, 12);
		LocalDateTime day2 = LocalDateTime.of(1999, 1, 3, 12, 12, 12);
		assertEquals(2, DateUtil.calculateTwoDateDiffAbs(day1, day2));
		assertEquals(2, DateUtil.calculateTwoDateDiffAbs(day2, day1));
	}

	@Test
	public void 일초차이_절댓값_계산() {
		LocalDateTime day1 = LocalDateTime.of(1999, 1, 1, 12, 12, 13);
		LocalDateTime day2 = LocalDateTime.of(1999, 1, 3, 12, 12, 12);
		assertEquals(1, DateUtil.calculateTwoDateDiffAbs(day1, day2));
		assertEquals(1, DateUtil.calculateTwoDateDiffAbs(day2, day1));
	}

	@Test
	public void 평범한_날_차이_계산() {
		LocalDateTime day1 = LocalDateTime.of(1999, 1, 1, 0, 0, 0);
		LocalDateTime day2 = LocalDateTime.of(1999, 1, 3, 0, 0, 0);
		assertEquals(-2, DateUtil.calculateTwoDateDiff(day1, day2));
		assertEquals(2, DateUtil.calculateTwoDateDiff(day2, day1));
	}

	@Test
	public void 세심한_날_차이_계산() {
		LocalDateTime day1 = LocalDateTime.of(1999, 1, 1, 12, 12, 12);
		LocalDateTime day2 = LocalDateTime.of(1999, 1, 3, 12, 12, 12);
		assertEquals(-2, DateUtil.calculateTwoDateDiff(day1, day2));
		assertEquals(2, DateUtil.calculateTwoDateDiff(day2, day1));
	}

	@Test
	public void 일초차이_계산() {
		LocalDateTime day1 = LocalDateTime.of(1999, 1, 1, 12, 12, 13);
		LocalDateTime day2 = LocalDateTime.of(1999, 1, 3, 12, 12, 12);
		assertEquals(-1, DateUtil.calculateTwoDateDiff(day1, day2));
		assertEquals(1, DateUtil.calculateTwoDateDiff(day2, day1));
	}

	@Test
	public void 날짜_더하기() {
		LocalDateTime tar = LocalDateTime.of(1999, 1, 1, 0, 0, 0);
		LocalDateTime rst = LocalDateTime.of(1999, 1, 4, 0, 0, 0);
		assertEquals(rst, tar.plusDays(3));
	}

	@Test
	public void 날짜_큰수_더하기() {
		LocalDateTime tar = LocalDateTime.of(1999, 1, 1, 0, 0, 0);
		LocalDateTime rst = LocalDateTime.of(1999, 2, 1, 0, 0, 0);
		assertEquals(rst, tar.plusDays(31));
	}

	@Test
	public void 날짜_더하기_잘못된_값() {
		LocalDateTime tar = LocalDateTime.of(1999, 1, 1, 0, 0, 0);
		LocalDateTime rst = LocalDateTime.of(1998, 12, 31, 0, 0, 0);
		assertEquals(rst, tar.plusDays(-1));
	}
}