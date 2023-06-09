package org.ftclub.cabinet.utils;

import static org.junit.jupiter.api.Assertions.*;

import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class ExceptionUtilTest {

	@Test
	void 익셉션_쓰로우_확인() {
		Assertions.assertThrows(ServiceException.class, () -> {
			ExceptionUtil.throwIfInvalid(false, new ServiceException(ExceptionStatus.INVALID_ARGUMENT));
		});
		Assertions.assertThrows(ControllerException.class, () -> {
			ExceptionUtil.throwIfInvalid(false, new ControllerException(ExceptionStatus.INVALID_ARGUMENT));
		});
		Assertions.assertThrows(DomainException.class, () -> {
			ExceptionUtil.throwIfInvalid(false, new DomainException(ExceptionStatus.INVALID_ARGUMENT));
		});
		Assertions.assertDoesNotThrow(() -> ExceptionUtil.throwIfInvalid(true, new DomainException(ExceptionStatus.INVALID_ARGUMENT)));
		Assertions.assertDoesNotThrow(() -> ExceptionUtil.throwIfInvalid(true, new ServiceException(ExceptionStatus.INVALID_ARGUMENT)));
		Assertions.assertDoesNotThrow(() -> ExceptionUtil.throwIfInvalid(true, new ControllerException(ExceptionStatus.INVALID_ARGUMENT)));
	}

}