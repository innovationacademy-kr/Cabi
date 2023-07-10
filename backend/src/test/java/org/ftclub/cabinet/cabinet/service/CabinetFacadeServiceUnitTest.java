package org.ftclub.cabinet.cabinet.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
import org.ftclub.cabinet.dto.CabinetPreviewDto;
import org.ftclub.cabinet.dto.CabinetSimpleDto;
import org.ftclub.cabinet.dto.CabinetSimplePaginationDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
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
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

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
	@Mock(lenient = true)
	CabinetMapper cabinetMapper;
	@Mock
	LentMapper lentMapper;
	@Mock
	Location locationMock;

	private ArrayList<Integer> generateFloors(int limit) {
		ArrayList<Integer> floors = new ArrayList<>();
		for (int i = 1; i <= limit; i++) {
			floors.add(i);
		}
		return floors;
	}

	@Test
	@DisplayName("성공: 건물과 층 개수 3개씩 담긴 dto를 가져온다 - 결과 3개")
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

		then(cabinetOptionalFetcher).should().findAllBuildings();
		then(cabinetOptionalFetcher).should(times(3)).findAllFloorsByBuilding(any());
		then(cabinetMapper).should(times(3)).toBuildingFloorsDto(any(), any());

		assertEquals(buildingFloorsResponse.get(0).getBuilding(), building1);
		assertEquals(buildingFloorsResponse.get(0).getFloors(), floors1);

		assertEquals(buildingFloorsResponse.get(1).getBuilding(), building2);
		assertEquals(buildingFloorsResponse.get(1).getFloors(), floors2);

		assertEquals(buildingFloorsResponse.get(2).getBuilding(), building3);
		assertEquals(buildingFloorsResponse.get(2).getFloors(), floors3);
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
	@DisplayName("성공: 캐비넷 정보 조회 - 결과 3개")
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
	@DisplayName("성공: 캐비넷 id로 정보 조회 - NULL")
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
	@DisplayName("성공: visibleNum으로 캐비넷 정보 page 조회 - 결과 3개")
	void 성공_getCabinetsSimpleInfoByVisibleNum() {
		//given
		Integer visibleNum = 1;

		Cabinet cabinet1 = mock(Cabinet.class);
		Cabinet cabinet2 = mock(Cabinet.class);
		Cabinet cabinet3 = mock(Cabinet.class);

		Location location1 = mock(Location.class);
		Location location2 = mock(Location.class);
		Location location3 = mock(Location.class);

		Page<Cabinet> allCabinetsByVisibleNum = new PageImpl<>(
				List.of(cabinet1, cabinet2, cabinet3));

		PageRequest pageRequest = PageRequest.of(0, Integer.MAX_VALUE);
		given(cabinetOptionalFetcher.findPaginationByVisibleNum(visibleNum, pageRequest))
				.willReturn(allCabinetsByVisibleNum);

		given(cabinetMapper.toCabinetSimpleDto(cabinet1)).willReturn(
				new CabinetSimpleDto(999L, location1, visibleNum));
		given(cabinetMapper.toCabinetSimpleDto(cabinet2)).willReturn(
				new CabinetSimpleDto(998L, location2, visibleNum));
		given(cabinetMapper.toCabinetSimpleDto(cabinet3)).willReturn(
				new CabinetSimpleDto(997L, location3, visibleNum));

		//when
		CabinetSimplePaginationDto result = cabinetFacadeService.getCabinetsSimpleInfoByVisibleNum(
				visibleNum);

		//then
		then(cabinetOptionalFetcher).should().findPaginationByVisibleNum(visibleNum, pageRequest);
		then(cabinetMapper).should(times(3)).toCabinetSimpleDto(any());

		assertEquals(3, result.getTotalLength());
		assertEquals(999L, result.getResult().get(0).getCabinetId());
		assertEquals(1, result.getResult().get(0).getVisibleNum());

		assertEquals(location1, result.getResult().get(0).getLocation());
		assertEquals(998L, result.getResult().get(1).getCabinetId());
		assertEquals(1, result.getResult().get(1).getVisibleNum());
		assertEquals(location2, result.getResult().get(1).getLocation());

		assertEquals(997L, result.getResult().get(2).getCabinetId());
		assertEquals(1, result.getResult().get(2).getVisibleNum());
		assertEquals(location3, result.getResult().get(2).getLocation());
	}


	@Test
	@DisplayName("성공: visibleNum으로 캐비넷 정보 page 조회 - 정보 없음")
	void 성공_NULL_getCabinetsSimpleInfoByVisibleNum() {
		//given
		Integer visibleNum = 3141592;
		PageRequest pageRequest = PageRequest.of(0, Integer.MAX_VALUE);

		given(cabinetOptionalFetcher.findPaginationByVisibleNum(visibleNum, pageRequest))
				.willReturn(Page.empty());

		//when
		CabinetSimplePaginationDto result = cabinetFacadeService.getCabinetsSimpleInfoByVisibleNum(
				visibleNum);

		//then
		then(cabinetOptionalFetcher).should().findPaginationByVisibleNum(visibleNum, pageRequest);
		then(cabinetMapper).should(times(0)).toCabinetSimpleDto(any());

		assertEquals(new ArrayList<>(), result.getResult());
		assertEquals(0, result.getTotalLength());
	}


	@Test
	void getCabinetsPerSection() {
		String building = "새롬관";
		Integer floor = 2;
		String section1 = "1클러스터끝";
		String section2 = "오아시스";
		String section3 = "2클러스터끝";
		String lentUserName = "제발 그만해";

		// FOR private method getCabinetPreviewBundle SETTINGS START
		Cabinet cabinet1 = mock(Cabinet.class);
		Cabinet cabinet2 = mock(Cabinet.class);
		Cabinet cabinet3 = mock(Cabinet.class);

		List<Cabinet> cabinetList = new ArrayList<>();
		cabinetList.add(cabinet1);
		cabinetList.add(cabinet2);
		cabinetList.add(cabinet3);
		Location location = Location.of(building, floor, section1);

		given(cabinetOptionalFetcher.findAllSectionsByBuildingAndFloor(building, floor))
				.willReturn(new ArrayList<String>(List.of(section1, section2, section3)));
		given(cabinetOptionalFetcher.findAllCabinetsByLocation(location))
				.willReturn(cabinetList);

		LentHistory lentHistory = mock(LentHistory.class);
		User userMock = mock(User.class);
		given(lentHistory.getUser()).willReturn(userMock);
		given(userMock.getName()).willReturn(lentUserName);
		ArrayList<LentHistory> lentHistories = new ArrayList<>(List.of(lentHistory));

		given(lentOptionalFetcher.findAllActiveLentByCabinetId(cabinet1.getCabinetId()))
				.willReturn(lentHistories);
		given(lentOptionalFetcher.findAllActiveLentByCabinetId(cabinet2.getCabinetId()))
				.willReturn(lentHistories);
		given(lentOptionalFetcher.findAllActiveLentByCabinetId(cabinet3.getCabinetId()))
				.willReturn(lentHistories);

		CabinetPreviewDto cabinetPreviewDto1 = mock(CabinetPreviewDto.class);
		CabinetPreviewDto cabinetPreviewDto2 = mock(CabinetPreviewDto.class);
		CabinetPreviewDto cabinetPreviewDto3 = mock(CabinetPreviewDto.class);

		given(cabinetMapper.toCabinetPreviewDto(cabinet1, lentHistories.size(), lentUserName))
				.willReturn(cabinetPreviewDto1);
		given(cabinetMapper.toCabinetPreviewDto(cabinet2, lentHistories.size(), lentUserName))
				.willReturn(cabinetPreviewDto2);
		given(cabinetMapper.toCabinetPreviewDto(cabinet3, lentHistories.size(), lentUserName))
				.willReturn(cabinetPreviewDto3);


		List<CabinetPreviewDto> cabinetPreviewDtoList = new ArrayList<>();
		cabinetPreviewDtoList.add(cabinetPreviewDto1);
		cabinetPreviewDtoList.add(cabinetPreviewDto2);
		cabinetPreviewDtoList.add(cabinetPreviewDto3);
		// FOR private method getCabinetPreviewBundle SETTINGS END


		CabinetsPerSectionResponseDto cabinetsPerSectionResponseDto1 = new CabinetsPerSectionResponseDto(section1, cabinetPreviewDtoList);
		CabinetsPerSectionResponseDto cabinetsPerSectionResponseDto2 = new CabinetsPerSectionResponseDto(section2, cabinetPreviewDtoList);
		CabinetsPerSectionResponseDto cabinetsPerSectionResponseDto3 = new CabinetsPerSectionResponseDto(section3, cabinetPreviewDtoList);
//		given(cabinetsPerSectionResponseDto1.getSection()).willReturn(section1);
//		given(cabinetsPerSectionResponseDto2.getSection()).willReturn(section2);
//		given(cabinetsPerSectionResponseDto3.getSection()).willReturn(section3);

		given(cabinetMapper.toCabinetsPerSectionResponseDto(section1,
				cabinetPreviewDtoList))
				.willReturn(cabinetsPerSectionResponseDto1);
		given(cabinetMapper.toCabinetsPerSectionResponseDto(section2,
				cabinetPreviewDtoList))
				.willReturn(cabinetsPerSectionResponseDto2);
		given(cabinetMapper.toCabinetsPerSectionResponseDto(section3,
				cabinetPreviewDtoList))
				.willReturn(cabinetsPerSectionResponseDto3);


		//when
		List<CabinetsPerSectionResponseDto> result = cabinetFacadeService.getCabinetsPerSection(
				building, floor);

		//then
		then(cabinetOptionalFetcher).should().findAllSectionsByBuildingAndFloor(building, floor);
		then(cabinetMapper).should(times(3)).toCabinetsPerSectionResponseDto(any(), any());

		assertEquals(cabinetsPerSectionResponseDto1, result.get(0));
		assertEquals(cabinetsPerSectionResponseDto2, result.get(1));
		assertEquals(cabinetsPerSectionResponseDto3, result.get(2));

//		assertEquals(cabinetsPerSectionResponseDto1, result.get(0).getCabinets());
//		assertEquals(cabinetsPerSectionResponseDto2, result.get(1).getCabinets());
//		assertEquals(cabinetsPerSectionResponseDto3, result.get(2).getCabinets());
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