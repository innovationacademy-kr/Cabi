package org.ftclub.cabinet.mapper;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Date;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CabinetMapperTest {

	@Autowired
	CabinetMapper cabinetMapper;

	@Test
	void toCabinetDto() {
		Location location = Location.of("testBuilding", 99, "testSection");
		Cabinet cabinet = Cabinet.of(1, CabinetStatus.AVAILABLE, LentType.SHARE, 10, Grid.of(1, 2),
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
		String targetBuilding = "targetBuilding";
		List<Integer> floors = List.of(1, 2, 3, 4, 5);

		BuildingFloorsDto buildingFloorsDto = cabinetMapper.toBuildingFloorsDto(targetBuilding,
				floors);
		assertEquals(targetBuilding, buildingFloorsDto.getBuilding());
		assertArrayEquals(floors.toArray(), buildingFloorsDto.getFloors().toArray());
	}

	@Test
	void toCabinetInfoResponseDto() {
		Location location = Location.of("buildingTest", 1, "testSection");
		CabinetDto cabinetDto = new CabinetDto(2L, 3, LentType.SHARE, 4, "title",
				CabinetStatus.AVAILABLE, location);
		LentDto lentDto1 = new LentDto(5L, "testName1", 6L, new Date(), new Date());
		LentDto lentDto2 = new LentDto(7L, "testName2", 8L, new Date(), new Date());
		List<LentDto> lentDtos = List.of(lentDto1, lentDto2);
		CabinetInfoResponseDto cabinetInfoResponseDto = cabinetMapper.toCabinetInfoResponseDto(
				cabinetDto, lentDtos);
		assertEquals(cabinetDto.getCabinetId(), cabinetInfoResponseDto.getCabinetId());
		assertEquals(cabinetDto.getStatus(), cabinetInfoResponseDto.getStatus());
		assertEquals(cabinetDto.getMaxUser(), cabinetInfoResponseDto.getMaxUser());
		assertEquals(cabinetDto.getLocation(), cabinetInfoResponseDto.getLocation());
		assertEquals(cabinetDto.getTitle(), cabinetInfoResponseDto.getTitle());
		assertEquals(cabinetDto.getVisibleNum(), cabinetInfoResponseDto.getVisibleNum());
		assertEquals(lentDtos, cabinetInfoResponseDto.getLents());
	}

	@Test
	void toCabinetsPerSectionResponseDto() {
		String section = "testSection";
		CabinetInfoResponseDto cabinetInfoResponseDto1 = new CabinetInfoResponseDto(1L, 2,
				LentType.SHARE, 3, "title", CabinetStatus.AVAILABLE, null, null);
		CabinetInfoResponseDto cabinetInfoResponseDto2 = new CabinetInfoResponseDto(2L, 5,
				LentType.SHARE, 3, "title", CabinetStatus.AVAILABLE, null, null);
		CabinetInfoResponseDto cabinetInfoResponseDto3 = new CabinetInfoResponseDto(3L, 6,
				LentType.SHARE, 3, "title", CabinetStatus.AVAILABLE, null, null);
		CabinetInfoResponseDto cabinetInfoResponseDto4 = new CabinetInfoResponseDto(4L, 7,
				LentType.SHARE, 3, "title", CabinetStatus.AVAILABLE, null, null);
		List<CabinetInfoResponseDto> cabinetInfoResponseDtos = List.of(cabinetInfoResponseDto1,
				cabinetInfoResponseDto2, cabinetInfoResponseDto3, cabinetInfoResponseDto4);
		CabinetsPerSectionResponseDto cabinetsPerSectionResponseDto = cabinetMapper.toCabinetsPerSectionResponseDto(
				section, cabinetInfoResponseDtos);
		assertEquals(section, cabinetsPerSectionResponseDto.getSection());
		assertArrayEquals(cabinetInfoResponseDtos.toArray(),
				cabinetsPerSectionResponseDto.getCabinets().toArray(new CabinetInfoResponseDto[0]));
	}
}