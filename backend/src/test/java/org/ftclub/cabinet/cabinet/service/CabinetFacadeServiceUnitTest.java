package org.ftclub.cabinet.cabinet.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;

import java.util.ArrayList;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cglib.core.Local;

@ExtendWith(MockitoExtension.class)
class CabinetFacadeServiceUnitTest {

	@InjectMocks
	CabinetFacadeServiceImpl cabinetFacadeService;
	@Mock
	CabinetOptionalFetcher cabinetOptionalFetcher;
	@Mock
	LentOptionalFetcher lentOptionalFetcher;
	@Mock
	UserOptionalFetcher userOptionalFetcher;
	@Mock
	CabinetMapper cabinetMapper;
	@Mock
	LentMapper lentMapper;

	private ArrayList<Integer> generateFloors(int limit) {
		ArrayList<Integer> floors = new ArrayList<>();
		for (int i = 1; i <= limit; i++) {
			floors.add(i);
		}
		return floors;
	}

	@Test
	@DisplayName("성공: 건물과 층 개수 3개씩 담긴 dto를 가져온다")
	void 성공_getBuildingFloorsResponse() {
		//setups
		String building1 = "개포클러스터";
		String building2 = "서초클러스터";
		String building3 = "우리집";

		ArrayList<Integer> floors1 = generateFloors(5);
		ArrayList<Integer> floors2 = generateFloors(8);
		ArrayList<Integer> floors3 = generateFloors(21);

		List<String> buildings = new ArrayList<>();
		buildings.add(building1);
		buildings.add(building2);
		buildings.add(building3);

		//given
		given(cabinetOptionalFetcher.findAllBuildings()).willReturn(buildings);
		given(cabinetOptionalFetcher.findAllFloorsByBuilding(building1)).willReturn(floors1);
		given(cabinetOptionalFetcher.findAllFloorsByBuilding(building2)).willReturn(floors2);
		given(cabinetOptionalFetcher.findAllFloorsByBuilding(building3)).willReturn(floors3);

		given(cabinetMapper.toBuildingFloorsDto(building1, floors1)).willReturn(
				new BuildingFloorsDto(building1, floors1));
		given(cabinetMapper.toBuildingFloorsDto(building2, floors2)).willReturn(
				new BuildingFloorsDto(building2, floors2));
		given(cabinetMapper.toBuildingFloorsDto(building3, floors3)).willReturn(
				new BuildingFloorsDto(building3, floors3));

		//when
		List<BuildingFloorsDto> buildingFloorsResponse = cabinetFacadeService.getBuildingFloorsResponse();

		//then
		assertEquals(buildingFloorsResponse.get(0).getBuilding(), building1);
		assertEquals(buildingFloorsResponse.get(0).getFloors(), floors1);

		assertEquals(buildingFloorsResponse.get(1).getBuilding(), building2);
		assertEquals(buildingFloorsResponse.get(1).getFloors(), floors2);

		assertEquals(buildingFloorsResponse.get(2).getBuilding(), building3);
		assertEquals(buildingFloorsResponse.get(2).getFloors(), floors3);

		then(cabinetOptionalFetcher).should().findAllBuildings();
		then(cabinetOptionalFetcher).should(times(3)).findAllFloorsByBuilding(any());
		then(cabinetMapper).should(times(3)).toBuildingFloorsDto(any(), any());
	}

	@Test
	@DisplayName("성공: 건물과 층 조회 - 정보 없음")
	void 성공_NULL_getBuildingFloorsResponse() {
		//given
		given(cabinetOptionalFetcher.findAllBuildings()).willReturn(new ArrayList<>());

		//when
		List<BuildingFloorsDto> buildingFloorsResponse = cabinetFacadeService.getBuildingFloorsResponse();
		//then
		assertNotNull(buildingFloorsResponse);
		then(cabinetOptionalFetcher).should().findAllBuildings();
	}

	@Test
	@DisplayName("성공: 캐비넷 정보 조회")
	void 성공_getCabinetInfo() {
		//given
		Long cabinetId = 123L;

		User findUser1 = mock(User.class);
		User findUser2 = mock(User.class);
		User findUser3 = mock(User.class);

		LentHistory lentHistory1 = mock(LentHistory.class);
		LentHistory lentHistory2 = mock(LentHistory.class);
		LentHistory lentHistory3 = mock(LentHistory.class);
		given(lentHistory1.getUser()).willReturn(findUser1);
		given(lentHistory2.getUser()).willReturn(findUser2);
		given(lentHistory3.getUser()).willReturn(findUser3);

		List<LentHistory> lentHistories = new ArrayList<>();
		lentHistories.add(lentHistory1);
		lentHistories.add(lentHistory2);
		lentHistories.add(lentHistory3);

		LentDto lentDto1 = mock(LentDto.class);
		LentDto lentDto2 = mock(LentDto.class);
		LentDto lentDto3 = mock(LentDto.class);
		Location location = mock(Location.class);
		Cabinet cabinet = mock(Cabinet.class);

		given(lentOptionalFetcher.findAllActiveLentByCabinetId(cabinetId))
				.willReturn(lentHistories);

		given(lentMapper.toLentDto(findUser1, lentHistory1))
				.willReturn(lentDto1);
		given(lentMapper.toLentDto(findUser2, lentHistory2))
				.willReturn(lentDto2);
		given(lentMapper.toLentDto(findUser3, lentHistory3))
				.willReturn(lentDto3);

		given(cabinetOptionalFetcher.findCabinet(cabinetId))
				.willReturn(cabinet);

		given(cabinetMapper.toCabinetInfoResponseDto(cabinet,
				List.of(lentDto1, lentDto2, lentDto3)))
				.willReturn(
						new CabinetInfoResponseDto(
								cabinetId,
								21,
								LentType.PRIVATE,
								3,
								"뭐가이렇게많냐",
								CabinetStatus.FULL,
								"THIS IS STATUS",
								location,
								List.of(lentDto1, lentDto2, lentDto3)
						)
				);

		// when
		CabinetInfoResponseDto cabinetInfo = cabinetFacadeService.getCabinetInfo(cabinetId);

		// then
		then(lentOptionalFetcher).should().findAllActiveLentByCabinetId(cabinetId);
		then(lentMapper).should(times(3)).toLentDto(any(), any());
		then(cabinetOptionalFetcher).should().findCabinet(cabinetId);

		assertEquals(cabinetInfo.getCabinetId(), cabinetId);
		assertEquals(cabinetInfo.getVisibleNum(), 21);
		assertEquals(cabinetInfo.getLentType(), LentType.PRIVATE);
		assertEquals(cabinetInfo.getMaxUser(), 3);
		assertEquals(cabinetInfo.getTitle(), "뭐가이렇게많냐");
		assertEquals(cabinetInfo.getStatus(), CabinetStatus.FULL);
		assertEquals(cabinetInfo.getStatusNote(), "THIS IS STATUS");
		assertEquals(cabinetInfo.getLocation(), location);
		assertEquals(cabinetInfo.getLents(), List.of(lentDto1, lentDto2, lentDto3));
	}


	@Test
	@DisplayName("성공: 캐비넷 정보 조회 - NULL")
	void 성공_NULL_getCabinetInfo() {
		//given
		Long cabinetId = -1L;

		given(lentOptionalFetcher.findAllActiveLentByCabinetId(cabinetId))
				.willReturn(new ArrayList<>());

		CabinetInfoResponseDto cabinetInfo = cabinetFacadeService.getCabinetInfo(cabinetId);

		// then
		then(lentOptionalFetcher).should().findAllActiveLentByCabinetId(cabinetId);
		then(lentMapper).should(times(0)).toLentDto(any(), any());
		then(cabinetOptionalFetcher).should().findCabinet(cabinetId);
		assertNull(cabinetInfo);
	}

	@Test
	void getCabinetsSimpleInfoByVisibleNum() {
	}

	@Test
	void getCabinetsPerSection() {
	}

	@Test
	void getCabinetPaginationByLentType() {
	}

	@Test
	void getCabinetPaginationByStatus() {
	}

	@Test
	void getCabinetPaginationByVisibleNum() {
	}

	@Test
	void getCabinetLentHistoriesPagination() {
	}

	@Test
	void getCabinetInfoBundle() {
	}

	@Test
	void getCabinetsInfo() {
	}

	@Test
	void updateCabinetStatusNote() {
	}

	@Test
	void updateCabinetTitle() {
	}

	@Test
	void updateCabinetGrid() {
	}

	@Test
	void updateCabinetVisibleNum() {
	}

	@Test
	void updateCabinetBundleStatus() {
	}
}