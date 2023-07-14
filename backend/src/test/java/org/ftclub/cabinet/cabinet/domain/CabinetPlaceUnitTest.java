package org.ftclub.cabinet.cabinet.domain;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

import org.ftclub.cabinet.exception.DomainException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class CabinetPlaceUnitTest {

	@Mock
	Location location = mock(Location.class);
	@Mock
	SectionFormation sectionFormation = mock(SectionFormation.class);
	@Mock
	MapArea mapArea = mock(MapArea.class);

	CabinetPlace cabinetPlace;

	@BeforeEach
	void setUp() {
		cabinetPlace = CabinetPlace.of(location, sectionFormation, mapArea);
	}

	@Test
	@DisplayName("CabinetPlace 생성 성공 테스트")
	void CabinetPlace_생성_성공() {
		assertDoesNotThrow(() -> CabinetPlace.of(location, sectionFormation, mapArea));
	}

	@Test
	@DisplayName("CabinetPlace 생성 실패 테스트")
	void CabinetPlace_생성_실패() {
		location = null;
		sectionFormation = null;
		mapArea = null;

		assertThrows(DomainException.class,
				() -> CabinetPlace.of(location, sectionFormation, mapArea));
	}

	@Test
	@DisplayName("equals 메서드 테스트 - 같은 클래스의 객체이고 cabinetPlaceId가 같으며 참조값이 같은 경우")
	void equals_같은_객체_완전_동일() {
		CabinetPlace other = cabinetPlace;

		assertTrue(() -> cabinetPlace.equals(other));
	}

	@Test
	@DisplayName("equals 메서드 테스트 - 다른 클래스의 객체인 경우")
	void equals_다른_객체() {
		String other = String.valueOf("test");

		assertFalse(() -> cabinetPlace.equals(other));
	}
}
