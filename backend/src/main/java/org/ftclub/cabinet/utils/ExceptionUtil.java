package org.ftclub.cabinet.utils;

import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;

public class ExceptionUtil {

	public static void throwIfInvalid(boolean isValid, RuntimeException exception) {
		if (!isValid) {
			throw exception;
		}
	}
}
