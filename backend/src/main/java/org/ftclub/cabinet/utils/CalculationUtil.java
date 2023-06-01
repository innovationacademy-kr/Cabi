package org.ftclub.cabinet.utils;

/**
 * 계산 유틸리티 클래스입니다.
 */
public class CalculationUtil {

	public static Integer countPages(Integer total, Integer size) {
		return Integer.divideUnsigned(total, size);
	}

}
