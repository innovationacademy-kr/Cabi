package org.ftclub.cabinet.utils;

public class ExceptionUtil {

	public static void throwIfFalse(boolean isTrue, RuntimeException exception) {
		if (!isTrue) {
			throw exception;
		}
	}
}
