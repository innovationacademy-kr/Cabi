package org.ftclub.cabinet.mapper;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.domain.MapArea;
import org.ftclub.cabinet.cabinet.domain.SectionFormation;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPreviewDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CabinetMapperTest {

	@Autowired
	CabinetMapper cabinetMapper;

	@Autowired
	CabinetRepository cabinetRepository;

	@Test
	void toCabinetDto() {
		Location location = Location.of("testBuilding", 99, "testSection");
		Cabinet cabinet = Cabinet.of(1, CabinetStatus.AVAILABLE, LentType.SHARE, 10, Grid.of(1, 2),
				CabinetPlace.of(location, SectionFormation.of(1, 1),
						MapArea.of(1, 1, 1, 1)));
		CabinetDto cabinetDto = cabinetMapper.toCabinetDto(cabinet);
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
		Cabinet cabinet = Cabinet.of(1, CabinetStatus.AVAILABLE, LentType.SHARE, 4, Grid.of(1, 2),
				CabinetPlace.of(Location.of("buildingTest", 1, "testSection"),
						SectionFormation.of(1, 1), MapArea.of(1, 1, 1, 1)));

		LentDto lentDto1 = new LentDto(5L, "testName1", 6L, LocalDateTime.now(),
				LocalDateTime.now());
		LentDto lentDto2 = new LentDto(7L, "testName2", 8L, LocalDateTime.now(),
				LocalDateTime.now());
		List<LentDto> lentDtos = List.of(lentDto1, lentDto2);
		CabinetInfoResponseDto cabinetInfoResponseDto = cabinetMapper.toCabinetInfoResponseDto(
				cabinet, lentDtos);
		assertEquals(cabinet.getCabinetId(), cabinetInfoResponseDto.getCabinetId());
		assertEquals(cabinet.getStatus(), cabinetInfoResponseDto.getStatus());
		assertEquals(cabinet.getMaxUser(), cabinetInfoResponseDto.getMaxUser());
		assertEquals(cabinet.getCabinetPlace().getLocation(), cabinetInfoResponseDto.getLocation());
		assertEquals(cabinet.getTitle(), cabinetInfoResponseDto.getTitle());
		assertEquals(cabinet.getVisibleNum(), cabinetInfoResponseDto.getVisibleNum());
		assertEquals(lentDtos, cabinetInfoResponseDto.getLents());
	}

	@Test
	void toCabinetsPerSectionResponseDto() {
		String section = "testSection";
		CabinetPreviewDto cabinetPreviewDto1 = new CabinetPreviewDto(1L, 2, "title",
				LentType.SHARE, 3, CabinetStatus.AVAILABLE, 1, null);
		CabinetPreviewDto cabinetPreviewDto2 = new CabinetPreviewDto(2L, 5, "title",
				LentType.SHARE, 3, CabinetStatus.AVAILABLE, 1, null);
		CabinetPreviewDto cabinetPreviewDto3 = new CabinetPreviewDto(3L, 6, "title",
				LentType.SHARE, 3, CabinetStatus.AVAILABLE, 1, null);
		CabinetPreviewDto cabinetPreviewDto4 = new CabinetPreviewDto(4L, 7, "title",
				LentType.SHARE, 3, CabinetStatus.AVAILABLE, 1, null);
		List<CabinetPreviewDto> cabinetPreviewDtos = List.of(cabinetPreviewDto1, cabinetPreviewDto2,
				cabinetPreviewDto3, cabinetPreviewDto4);
		CabinetsPerSectionResponseDto cabinetsPerSectionResponseDto = cabinetMapper.toCabinetsPerSectionResponseDto(
				section, cabinetPreviewDtos);
		System.out.println("cabinetsPerSectionResponseDto = " + cabinetsPerSectionResponseDto);
		assertEquals(section, cabinetsPerSectionResponseDto.getSection());
		assertEquals(cabinetPreviewDtos, cabinetsPerSectionResponseDto.getCabinets());
	}
}