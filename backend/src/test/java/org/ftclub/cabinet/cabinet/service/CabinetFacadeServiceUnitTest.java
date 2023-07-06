package org.ftclub.cabinet.cabinet.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;

import java.util.ArrayList;
import java.util.List;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeServiceImpl;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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

	private ArrayList<Integer> generateFloors(int limit){
		ArrayList<Integer> floors = new ArrayList<>();
		for(int i = 1; i <= limit; i++) {
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

		given(cabinetMapper.toBuildingFloorsDto(building1, floors1)).willReturn(new BuildingFloorsDto(building1, floors1));
		given(cabinetMapper.toBuildingFloorsDto(building2, floors2)).willReturn(new BuildingFloorsDto(building2, floors2));
		given(cabinetMapper.toBuildingFloorsDto(building3, floors3)).willReturn(new BuildingFloorsDto(building3, floors3));

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

	//WIP
	@Test
	@DisplayName("성공: 건물과 층 조회 - 정보 없음")
	void 성공_NULL_getBuildingFloorsResponse() {
		//setups

		//given
		given(cabinetOptionalFetcher.findAllBuildings()).willReturn(null);

		//when
		List<BuildingFloorsDto> buildingFloorsResponse = cabinetFacadeService.getBuildingFloorsResponse();
		//then
		assertNull(buildingFloorsResponse);
		then(cabinetOptionalFetcher).should().findAllBuildings();
	}

	@Test
	void getCabinetInfo() {
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