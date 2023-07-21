package org.ftclub.cabinet.cabinet.domain;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.ftclub.cabinet.exception.DomainException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class LocationUnitTest {

	@Test
	@DisplayName("Location 생성 성공 테스트 - 인자가 유효한 경우")
	void of_성공() {
		String building = String.valueOf("새롬관");
		Integer floor = Integer.valueOf(2);
		String section = String.valueOf("A구역");

		assertDoesNotThrow(() -> Location.of(building, floor, section));
	}

	@Test
	@DisplayName("Location 생성 실패 테스트 - 인자가 유효하지 않은 경우")
	void of_실패() {
		String building = null;
		Integer floor = 0;
		String section = null;

		assertThrows(DomainException.class, () -> Location.of(building, floor, section));
	}
}
