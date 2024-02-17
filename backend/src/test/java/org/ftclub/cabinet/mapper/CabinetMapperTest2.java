package org.ftclub.cabinet.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CabinetMapperTest2 {

	CabinetMapper mapper = CabinetMapper.INSTANCE;

	// 테스트 인스턴스
	Cabinet cabinet;
	User user;
	LentHistory lentHistory;

	@BeforeEach
	void setUp() {
		// 사물함
//		cabinet = Cabinet.of(1, CabinetStatus.AVAILABLE, LentType.PRIVATE, 1,
//				Grid.of(1, 1),
//				CabinetPlace.of(
//						Location.of("building", 1, "section"),
//						SectionFormation.of(1, 1),
//						MapArea.of(1, 1, 1, 1)));
//		// 사용자
//		user = User.of("user", "email@email.com", DateUtil.getInfinityDate(), UserRole.USER);
//		// 대여 기록
//		lentHistory = LentHistory.of(LocalDateTime.now(), DateUtil.getInfinityDate(), 1L,
//				1L);

	}

	@Test
	@DisplayName("CabinetDto 매핑 성공")
	void toCabinetDto_성공() {
		CabinetDto dto = mapper.toCabinetDto(cabinet);
		assertEquals(cabinet.getId(), dto.getCabinetId());
		assertEquals(cabinet.getVisibleNum(), dto.getVisibleNum());
		assertEquals(cabinet.getCabinetPlace().getLocation(), dto.getLocation());
		assertEquals(cabinet.getLentType(), dto.getLentType());
		assertEquals(cabinet.getMaxUser(), dto.getMaxUser());
		assertEquals(cabinet.getTitle(), dto.getTitle());
		assertEquals(cabinet.getStatus(), dto.getStatus());
		assertEquals(cabinet.getStatusNote(), dto.getStatusNote());
	}

	@Test
	@DisplayName("CabinetDto null 매핑 성공 - null 프로퍼티를 갖는 Dto 반환")
	void toCabinetDto_성공_null_값() {
		CabinetDto dto = mapper.toCabinetDto(null);
		assertNull(dto.getCabinetId());
		assertNull(dto.getVisibleNum());
		assertNull(dto.getLocation());
		assertNull(dto.getLentType());
		assertNull(dto.getMaxUser());
		assertNull(dto.getTitle());
		assertNull(dto.getStatus());
		assertNull(dto.getStatusNote());
	}

	@Test
	@DisplayName("OverdueUserCabinetDto 매핑 성공")
	void toOverdueUserCabinetDto_성공() {
	}

	@Test
	@DisplayName("BuildingFloorsDto 매핑 성공")
	void toBuildingFloorsDto_성공() {
	}

	@Test
	@DisplayName("CabinetsPerSectionResponseDto 매핑 성공")
	void toCabinetsPerSectionResponseDto_성공() {
	}

	@Test
	@DisplayName("CabinetInfoResponseDto 매핑 성공")
	void toCabinetInfoResponseDto_성공() {
	}

	@Test
	@DisplayName("CabinetPaginationDtoList 매핑 성공")
	void toCabinetPaginationDtoList_성공() {
	}

	@Test
	@DisplayName("OverdueUserCabinetPaginationDto 매핑 성공")
	void toOverdueUserCabinetPaginationDto_성공() {
	}

	@Test
	@DisplayName("MyCabinetResponseDto 매핑 성공")
	void toMyCabinetResponseDto_성공() {
	}
}