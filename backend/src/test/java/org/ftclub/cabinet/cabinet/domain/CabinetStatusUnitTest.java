package org.ftclub.cabinet.cabinet.domain;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class CabinetStatusUnitTest {

	@Test
	@DisplayName("CabinetStatus의 isValid() 테스트 - 유효한 경우")
	void isValid_성공() {
		CabinetStatus cabinetStatusAvailable = CabinetStatus.AVAILABLE;
		CabinetStatus cabinetStatusFull = CabinetStatus.FULL;
		CabinetStatus cabinetStatusBroken = CabinetStatus.BROKEN;
		CabinetStatus cabinetStatusLimitedAvailable = CabinetStatus.LIMITED_AVAILABLE;
		CabinetStatus cabinetStatusOverdue = CabinetStatus.OVERDUE;
		CabinetStatus cabinetStatusPending = CabinetStatus.PENDING;
		CabinetStatus cabinetStatusIsSession = CabinetStatus.IS_SESSION;

		assertTrue(cabinetStatusAvailable.isValid());
		assertTrue(cabinetStatusFull.isValid());
		assertTrue(cabinetStatusBroken.isValid());
		assertTrue(cabinetStatusLimitedAvailable.isValid());
		assertTrue(cabinetStatusOverdue.isValid());
		assertTrue(cabinetStatusPending.isValid());
		assertTrue(cabinetStatusIsSession.isValid());
	}
}
