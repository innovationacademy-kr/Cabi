package org.ftclub.cabinet.cabinet.domain;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.ftclub.cabinet.exception.DomainException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class MapAreaUnitTest {

	@Test
	@DisplayName("MapArea 생성 성공 테스트 - 인자가 유효한 경우")
	void of_성공() {
		Integer startX = Integer.valueOf(1);
		Integer endX = Integer.valueOf(1);
		Integer startY = Integer.valueOf(1);
		Integer endY = Integer.valueOf(1);

		assertDoesNotThrow(() -> MapArea.of(startX, endX, startY, endY));
	}

	@Test
	@DisplayName("MapArea 생성 실패 테스트 - 인자가 유효하지 않은 경우")
	void of_실패() {
		Integer startX = Integer.valueOf(-1);
		Integer endX = Integer.valueOf(-1);
		Integer startY = Integer.valueOf(-1);
		Integer endY = Integer.valueOf(-1);

		assertThrows(DomainException.class, () -> MapArea.of(startX, endX, startY, endY));
	}
}
