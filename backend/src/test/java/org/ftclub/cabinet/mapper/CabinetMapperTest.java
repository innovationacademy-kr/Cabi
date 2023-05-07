package org.ftclub.cabinet.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.CabinetDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CabinetMapperTest {

	@Autowired
	CabinetMapper cabinetMapper;

	@Test
	void toCabinetDto() {
		Location location = new Location("testBuilding", 99, "testSection");
		Cabinet cabinet = Cabinet.of(1, CabinetStatus.AVAILABLE, LentType.SHARE, 10, new Grid(1, 2),
				CabinetPlace.of(null, null, null));
		CabinetDto cabinetDto = cabinetMapper.toCabinetDto(location, cabinet);
		assertEquals(cabinet.getCabinetId(), cabinetDto.getCabinetId());
		assertEquals(cabinet.getVisibleNum(), cabinetDto.getVisibleNum());
		assertEquals(cabinet.getLentType(), cabinetDto.getLentType());
		assertEquals(cabinet.getMaxUser(), cabinetDto.getMaxUser());
		assertEquals(cabinet.getTitle(), cabinetDto.getTitle());
		assertEquals(cabinet.getStatus(), cabinetDto.getStatus());
		assertEquals(location, cabinetDto.getLocation());
	}

	@Test
	void toBuildingFloorsDto() {
	}

	@Test
	void toCabinetInfoResponseDto() {
	}

	@Test
	void toCabinetsPerSectionResponseDto() {
	}
}