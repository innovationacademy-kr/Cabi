package org.ftclub.cabinet.cabinet.domain;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.ftclub.cabinet.exception.DomainException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class GridUnitTest {

	@Test
	@DisplayName("Grid 생성 성공 테스트")
	void of_성공() {
		Integer row = 1;
		Integer col = 1;

		assertDoesNotThrow(() -> Grid.of(row, col));
	}

	@Test
	@DisplayName("Grid 생성 실패 테스트")
	void of_실패() {
		Integer row = -1;
		Integer col = -1;

		assertThrows(DomainException.class, () -> Grid.of(row, col));
	}
}
