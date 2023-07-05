package org.ftclub.cabinet.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import org.junit.jupiter.api.DisplayName;
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

	@Test
	@DisplayName("성공: 같은 날짜")
	public void 성공_isSameDay() {
		LocalDateTime time = LocalDateTime.now();
		assertTrue(DateUtil.isSameDay(time));
	}
	@Test
	@DisplayName("실패: 하루 전 날짜")
	public void 실패_하루전_isSameDay() {
		LocalDateTime time = LocalDateTime.now().minusDays(1);
		assertFalse(DateUtil.isSameDay(time));
	}

	@Test
	@DisplayName("실패: 하루 뒤 날짜")
	public void 실패_하루뒤_isSameDay() {
		LocalDateTime time = LocalDateTime.now().plusDays(1);
		assertFalse(DateUtil.isSameDay(time));
	}

	@Test
	@DisplayName("성공: 과거시간")
	public void 성공_하루전_isPast() {
		LocalDateTime time = LocalDateTime.now().minusDays(1);
		assertTrue(DateUtil.isPast(time));
	}

	@Test
	@DisplayName("실패: 과거 아님")
	public void 실패_하루_후_isPast() {
		LocalDateTime time = LocalDateTime.now().plusDays(1);
		assertFalse(DateUtil.isPast(time));
	}
}