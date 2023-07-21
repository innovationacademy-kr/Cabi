package org.ftclub.cabinet.cabinet.domain;

import static org.junit.jupiter.api.Assertions.*;

import org.ftclub.cabinet.exception.DomainException;
import org.junit.jupiter.api.Test;

public class CabinetDomainTest {

	@Test
	void Grid_생성() {
		assertDoesNotThrow(() -> Grid.of(0, 0));
		assertThrows(DomainException.class, () -> Grid.of(-42, 0));
	}

	@Test
	void SectionFormation_생성() {
		assertDoesNotThrow(() -> SectionFormation.of(1, 1));
		assertThrows(DomainException.class, () -> SectionFormation.of(-42, 0));
	}


	@Test
	void MapArea_생성() {
		assertDoesNotThrow(() -> MapArea.of(1, 1, 1, 1));
		assertThrows(DomainException.class, () -> MapArea.of(-42, 0, 0, 0));
	}

	@Test
	void Location_생성() {
		assertDoesNotThrow(() -> Location.of("새롬관", 1, "오아시스"));
		assertThrows(DomainException.class, () -> Location.of(null, 1, "오아시스"));
		assertThrows(DomainException.class, () -> Location.of("새롬관", 0, "오아시스"));
		assertThrows(DomainException.class, () -> Location.of("새롬관", -1, "오아시스"));
	}

	 @Test
	 void CabinetPlace_생성() {
 assertDoesNotThrow(() -> CabinetPlace.of(
		 Location.of("새롬관", 1, "오아시스"),
		 SectionFormation.of(1, 1),
		 MapArea.of(1, 1, 1, 1)));

		 assertThrows(DomainException.class, () -> CabinetPlace.of(
				 null,
				 SectionFormation.of(1, 1),
				 MapArea.of(1, 1, 1, 1)));
	 }
	@Test
	void Cabinet_생성() {
		assertDoesNotThrow(() -> Cabinet.of(
				1,
				CabinetStatus.AVAILABLE,
				LentType.PRIVATE,
				1,
				Grid.of(1, 1),
				CabinetPlace.of(
						Location.of("새롬관", 1, "오아시스"),
						SectionFormation.of(1, 1),
						MapArea.of(1, 1, 1, 1))));
		assertThrows(DomainException.class, () -> Cabinet.of(
				1,
				CabinetStatus.AVAILABLE,
				LentType.PRIVATE,
				1,
				Grid.of(1, 1),
				null));
	}

}
