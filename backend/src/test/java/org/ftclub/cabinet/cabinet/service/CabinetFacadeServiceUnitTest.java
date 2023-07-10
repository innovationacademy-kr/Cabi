package org.ftclub.cabinet.cabinet.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoPaginationDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPaginationDto;
import org.ftclub.cabinet.dto.CabinetPreviewDto;
import org.ftclub.cabinet.dto.CabinetSimpleDto;
import org.ftclub.cabinet.dto.CabinetSimplePaginationDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.ftclub.testutils.TestUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

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
	@DisplayName("성공: 빌딩, 층수로 section 별 캐비넷 정보 가져오기")
	void 성공_getCabinetsPerSection() {
		//============================== SETUP LITERALS ==============================

		String building = "새롬관";
		Integer floor = 2;
		String section1 = "1클러스터끝";
		String section2 = "오아시스";
		String section3 = "2클러스터끝";
		String lentUserName1 = "제발 그만해";
		String lentUserName2 = "이러다";
		String lentUserName3 = "다 죽어";

		//============================== GIVEN ==============================

		//[GIVEN]START: getCabinetPreviewBundle
		Cabinet cabinet1 = mock(Cabinet.class);
		Cabinet cabinet2 = mock(Cabinet.class);
		Cabinet cabinet3 = mock(Cabinet.class);
		given(cabinet1.getCabinetId()).willReturn(1L);
		given(cabinet2.getCabinetId()).willReturn(2L);
		given(cabinet3.getCabinetId()).willReturn(3L);

		User user1 = mock(User.class);
		User user2 = mock(User.class);
		User user3 = mock(User.class);
		given(user1.getName()).willReturn(lentUserName1);
		given(user2.getName()).willReturn(lentUserName2);
		given(user3.getName()).willReturn(lentUserName3);

		LentHistory lentHistory1 = mock(LentHistory.class);
		LentHistory lentHistory2 = mock(LentHistory.class);
		LentHistory lentHistory3 = mock(LentHistory.class);

		given(lentHistory1.getUser()).willReturn(user1);
		given(lentHistory2.getUser()).willReturn(user2);
		given(lentHistory3.getUser()).willReturn(user3);

		List<LentHistory> lentHistories1 = new ArrayList<>(
				List.of(lentHistory1, lentHistory2, lentHistory3));
		List<LentHistory> lentHistories2 = new ArrayList<>(
				List.of(lentHistory2, lentHistory1, lentHistory3));
		List<LentHistory> lentHistories3 = new ArrayList<>(
				List.of(lentHistory3, lentHistory2, lentHistory1));
		// Section 별로 각각 다른 Cabinet List 반환 (테스트상 편의를 위해, 캐비넷 구성요소는 같으나 실제로는 다른 캐비넷임)
		given(cabinetOptionalFetcher.findAllCabinetsByLocation(
				Location.of(building, floor, section1)))
				.willReturn(List.of(cabinet1, cabinet2, cabinet3));
		given(cabinetOptionalFetcher.findAllCabinetsByLocation(
				Location.of(building, floor, section2)))
				.willReturn(List.of(cabinet1, cabinet2, cabinet3));
		given(cabinetOptionalFetcher.findAllCabinetsByLocation(
				Location.of(building, floor, section3)))
				.willReturn(List.of(cabinet1, cabinet2, cabinet3));

		// 캐비넷 리스트를 돌면서 활성화(lentHistory.endedAt == null)  대여기록 조회
		given(lentOptionalFetcher.findAllActiveLentByCabinetId(cabinet1.getCabinetId()))
				.willReturn(lentHistories1);
		given(lentOptionalFetcher.findAllActiveLentByCabinetId(cabinet2.getCabinetId()))
				.willReturn(lentHistories2);
		given(lentOptionalFetcher.findAllActiveLentByCabinetId(cabinet3.getCabinetId()))
				.willReturn(lentHistories3);

		// 캐비넷 리스트롤, 활성화된 대여기록에서 대여자 이름을 찾고, PreviewDto 로 변환
		CabinetPreviewDto cabinetPreviewDto1 = mock(CabinetPreviewDto.class);
		CabinetPreviewDto cabinetPreviewDto2 = mock(CabinetPreviewDto.class);
		CabinetPreviewDto cabinetPreviewDto3 = mock(CabinetPreviewDto.class);
		given(cabinetMapper.toCabinetPreviewDto(cabinet1, lentHistories1.size(), lentUserName1))
				.willReturn(cabinetPreviewDto1);
		given(cabinetMapper.toCabinetPreviewDto(cabinet2, lentHistories2.size(), lentUserName2))
				.willReturn(cabinetPreviewDto2);
		given(cabinetMapper.toCabinetPreviewDto(cabinet3, lentHistories3.size(), lentUserName3))
				.willReturn(cabinetPreviewDto3);
		// 최종적으로는 map().collect 로 캐비넷별로 List <CabinetPrevieDto> 반환
		// [GIVEN]END: getCabinetPreviewBundle

		given(cabinetOptionalFetcher.findAllSectionsByBuildingAndFloor(building, floor)).willReturn(
				new ArrayList<>(List.of(section1, section2, section3)));

		// 테스트 편의상 cabinetPreviewDto1,2,3 순서를 그대로 함
		List<CabinetPreviewDto> getCabinetPreviewBundleResult1 = new ArrayList<>(
				List.of(cabinetPreviewDto1, cabinetPreviewDto2, cabinetPreviewDto3));
		List<CabinetPreviewDto> getCabinetPreviewBundleResult2 = new ArrayList<>(
				List.of(cabinetPreviewDto1, cabinetPreviewDto2, cabinetPreviewDto3));
		List<CabinetPreviewDto> getCabinetPreviewBundleResult3 = new ArrayList<>(
				List.of(cabinetPreviewDto1, cabinetPreviewDto2, cabinetPreviewDto3));

		given(cabinetMapper.toCabinetsPerSectionResponseDto(section1,
				getCabinetPreviewBundleResult1))
				.willReturn(new CabinetsPerSectionResponseDto(section1,
						getCabinetPreviewBundleResult1));
		given(cabinetMapper.toCabinetsPerSectionResponseDto(section2,
				getCabinetPreviewBundleResult2))
				.willReturn(new CabinetsPerSectionResponseDto(section2,
						getCabinetPreviewBundleResult2));
		given(cabinetMapper.toCabinetsPerSectionResponseDto(section3,
				getCabinetPreviewBundleResult3))
				.willReturn(new CabinetsPerSectionResponseDto(section3,
						getCabinetPreviewBundleResult3));

		//============================== WHEN ==============================
		List<CabinetsPerSectionResponseDto> result = cabinetFacadeService.getCabinetsPerSection(
				building, floor);

		//============================== THEN ==============================

		then(cabinetOptionalFetcher).should(times(1))
				.findAllSectionsByBuildingAndFloor(building, floor);

		//[THEN]START: getCabinetPreviewBundle()
		then(cabinetOptionalFetcher).should(times(3)).findAllCabinetsByLocation(any());
		then(lentOptionalFetcher).should(times(3))
				.findAllActiveLentByCabinetId(cabinet1.getCabinetId());
		then(lentOptionalFetcher).should(times(3))
				.findAllActiveLentByCabinetId(cabinet2.getCabinetId());
		then(lentOptionalFetcher).should(times(3))
				.findAllActiveLentByCabinetId(cabinet3.getCabinetId());
		then(cabinetMapper).should(times(9)).toCabinetPreviewDto(any(), anyInt(), anyString());
		//[THEN]END:  getCabinetPreviewBundle()

		// section 기준으로 section과, 위에서 반환된 cabinetPreviewDtoList 를 넣어서 DTO 변환
		then(cabinetMapper).should().toCabinetsPerSectionResponseDto(section1,
				getCabinetPreviewBundleResult1);
		then(cabinetMapper).should().toCabinetsPerSectionResponseDto(section2,
				getCabinetPreviewBundleResult2);
		then(cabinetMapper).should().toCabinetsPerSectionResponseDto(section3,
				getCabinetPreviewBundleResult3);

		assertEquals(section1, result.get(0).getSection());
		assertEquals(section2, result.get(1).getSection());
		assertEquals(section3, result.get(2).getSection());

		assertEquals(getCabinetPreviewBundleResult1, result.get(0).getCabinets());
		assertEquals(getCabinetPreviewBundleResult2, result.get(1).getCabinets());
		assertEquals(getCabinetPreviewBundleResult3, result.get(2).getCabinets());
	}


	@Test
	@DisplayName("성공: 빌딩, 빌딩 혹은 층수에 해당하는 결과가 없을경우")
	void 성공_EMPTY_getCabinetsPerSection() {
		String building = "유토피아";
		Integer floor = 999;
		ArrayList<String> emptyList = new ArrayList<>();

		given(cabinetOptionalFetcher.findAllSectionsByBuildingAndFloor(building, floor))
				.willReturn(emptyList);

		List<CabinetsPerSectionResponseDto> result = cabinetFacadeService
				.getCabinetsPerSection(building, floor);

		then(cabinetOptionalFetcher).should().findAllSectionsByBuildingAndFloor(building, floor);
		assertNotNull(result);
	}

	@Test
	@DisplayName("성공: 해당하는 Location 없음 - 결과 null")
	void 성공_NULL_getCabinetsPerSection() {
		String building = "유토피아";
		String section = "콜로라도";
		Integer floor = 999;

		given(cabinetOptionalFetcher.findAllSectionsByBuildingAndFloor(building, floor))
				.willReturn(new ArrayList<String>(List.of(section)));

		given(cabinetOptionalFetcher.findAllCabinetsByLocation(any()))
				.willReturn(new ArrayList<Cabinet>());

		List<CabinetsPerSectionResponseDto> result = cabinetFacadeService
				.getCabinetsPerSection(building, floor);

		then(cabinetOptionalFetcher).should().findAllSectionsByBuildingAndFloor(building, floor);
		then(cabinetOptionalFetcher).should().findAllCabinetsByLocation(any());
		assertNotNull(result);
	}

	@Test
	@DisplayName("성공: 반납하지 않은 캐비넷이 없음 - 결과 null")
	void 성공_findAllActiveLentByCabinetId_EMPTY_getCabinetsPerSection() {
		String building = "유토피아";
		String section = "콜로라도";
		Integer floor = 999;

		given(cabinetOptionalFetcher.findAllSectionsByBuildingAndFloor(building, floor))
				.willReturn(new ArrayList<String>(List.of(section)));

		given(cabinetOptionalFetcher.findAllCabinetsByLocation(any()))
				.willReturn(new ArrayList<Cabinet>(List.of(mock(Cabinet.class))));

		given(lentOptionalFetcher.findAllActiveLentByCabinetId(any()))
				.willReturn(new ArrayList<LentHistory>());
		// when
		List<CabinetsPerSectionResponseDto> result = cabinetFacadeService
				.getCabinetsPerSection(building, floor);

		then(cabinetOptionalFetcher).should().findAllSectionsByBuildingAndFloor(building, floor);
		then(cabinetOptionalFetcher).should().findAllCabinetsByLocation(any());
		then(lentOptionalFetcher).should().findAllActiveLentByCabinetId(any());

		assertNotNull(result);
	}

	@Test
	@DisplayName("성공: 대여타입으로 캐비넷 정보 page로 가져오기 1페이지, 최대 10개 - 결과 3개 (개인 캐비넷)")
	void 성공_getCabinetPaginationByLentType() {
		Integer page = 0;
		Integer size = 10;
		PageRequest pageRequest = PageRequest.of(page, size);
		LentType lentType = LentType.PRIVATE;

		Cabinet cabinet1 = mock(Cabinet.class);
		Cabinet cabinet2 = mock(Cabinet.class);
		Cabinet cabinet3 = mock(Cabinet.class);
		List<Cabinet> cabinetList = new ArrayList<>(List.of(cabinet1, cabinet2, cabinet3));

		CabinetDto cabinetDto1 = mock(CabinetDto.class);
		CabinetDto cabinetDto2 = mock(CabinetDto.class);
		CabinetDto cabinetDto3 = mock(CabinetDto.class);

		Page<Cabinet> cabinets = new PageImpl<>(cabinetList);

		given(cabinetOptionalFetcher.findPaginationByLentType(lentType, pageRequest))
				.willReturn(cabinets);

		given(cabinetMapper.toCabinetDto(cabinet1)).willReturn(cabinetDto1);
		given(cabinetMapper.toCabinetDto(cabinet2)).willReturn(cabinetDto2);
		given(cabinetMapper.toCabinetDto(cabinet3)).willReturn(cabinetDto3);

		List<CabinetDto> cabinetDtos = new ArrayList<>(
				List.of(cabinetDto1, cabinetDto2, cabinetDto3));

		CabinetPaginationDto cabinetPaginationDto = new CabinetPaginationDto(cabinetDtos,
				cabinets.getTotalElements());
		given(cabinetMapper.toCabinetPaginationDtoList(cabinetDtos, cabinets.getTotalElements()))
				.willReturn(cabinetPaginationDto);

		// when
		CabinetPaginationDto result = cabinetFacadeService
				.getCabinetPaginationByLentType(LentType.PRIVATE, page, size);

		then(cabinetOptionalFetcher).should()
				.findPaginationByLentType(LentType.PRIVATE, pageRequest);
		then(cabinetMapper).should().toCabinetDto(cabinet1);
		then(cabinetMapper).should().toCabinetDto(cabinet2);
		then(cabinetMapper).should().toCabinetDto(cabinet3);

		assertEquals(3, result.getTotalLength());
		assertEquals(cabinetDto1, result.getResult().get(0));
		assertEquals(cabinetDto2, result.getResult().get(1));
		assertEquals(cabinetDto3, result.getResult().get(2));
	}


	@Test
	@DisplayName("성공: 대여타입으로 캐비넷 정보 page로 가져오기 - 사이즈 제한없음 (개인 캐비넷)")
	void 성공_UNLIMIT_getCabinetPaginationByLentType() {
		Integer page = 1;
		Integer size = 0;
		PageRequest pageRequest = PageRequest.of(page, Integer.MAX_VALUE);

		List<Cabinet> cabinetList = TestUtils.createTestMockList(Cabinet.class, 11);
		List<CabinetDto> cabinetDtos = TestUtils.createTestMockList(CabinetDto.class, 11);

		Page<Cabinet> cabinets = new PageImpl<>(cabinetList);
		given(cabinetOptionalFetcher.findPaginationByLentType(LentType.PRIVATE, pageRequest))
				.willReturn(cabinets);

		//0 ~ 10까지
		given(cabinetMapper.toCabinetDto(cabinetList.get(0))).willReturn(cabinetDtos.get(0));
		given(cabinetMapper.toCabinetDto(cabinetList.get(1))).willReturn(cabinetDtos.get(1));
		given(cabinetMapper.toCabinetDto(cabinetList.get(2))).willReturn(cabinetDtos.get(2));
		given(cabinetMapper.toCabinetDto(cabinetList.get(3))).willReturn(cabinetDtos.get(3));
		given(cabinetMapper.toCabinetDto(cabinetList.get(4))).willReturn(cabinetDtos.get(4));
		given(cabinetMapper.toCabinetDto(cabinetList.get(5))).willReturn(cabinetDtos.get(5));
		given(cabinetMapper.toCabinetDto(cabinetList.get(6))).willReturn(cabinetDtos.get(6));
		given(cabinetMapper.toCabinetDto(cabinetList.get(7))).willReturn(cabinetDtos.get(7));
		given(cabinetMapper.toCabinetDto(cabinetList.get(8))).willReturn(cabinetDtos.get(8));
		given(cabinetMapper.toCabinetDto(cabinetList.get(9))).willReturn(cabinetDtos.get(9));
		given(cabinetMapper.toCabinetDto(cabinetList.get(10))).willReturn(cabinetDtos.get(10));

		CabinetPaginationDto cabinetPaginationDto = new CabinetPaginationDto(cabinetDtos,
				cabinets.getTotalElements());
		given(cabinetMapper.toCabinetPaginationDtoList(cabinetDtos, cabinets.getTotalElements()))
				.willReturn(cabinetPaginationDto);

		// when
		CabinetPaginationDto result = cabinetFacadeService
				.getCabinetPaginationByLentType(LentType.PRIVATE, page, size);

		then(cabinetOptionalFetcher).should()
				.findPaginationByLentType(LentType.PRIVATE, pageRequest);
		then(cabinetMapper).should(times(11)).toCabinetDto(any(Cabinet.class));

		assertEquals(cabinets.getTotalElements(), result.getTotalLength());
	}

	@Test
	@DisplayName("성공: 대여타입으로 찾은 캐비넷 결과 정보 없음 (동아리 캐비넷)")
	void 성공_NULL_getCabinetPaginationByLentType() {
		Integer page = 0;
		Integer size = 5;
		PageRequest pageRequest = PageRequest.of(page, size);

		given(cabinetOptionalFetcher.findPaginationByLentType(LentType.CLUB, pageRequest))
				.willReturn(Page.empty());

		// when
		CabinetPaginationDto result = cabinetFacadeService
				.getCabinetPaginationByLentType(LentType.CLUB, page, size);

		then(cabinetOptionalFetcher).should()
				.findPaginationByLentType(LentType.CLUB, pageRequest);
		assertNull(result);
	}

	@Test
	@DisplayName("성공: 캐비넷 상태로 캐비넷 정보 page로 가져오기 (캐비넷 상태 대여가능)")
	void 성공_getCabinetPaginationByStatus() {
		Integer page = 0;
		Integer size = 5;
		CabinetStatus cabinetStatus = CabinetStatus.AVAILABLE;
		PageRequest pageRequest = PageRequest.of(page, size);

		Cabinet cabinet1 = mock(Cabinet.class);
		Cabinet cabinet2 = mock(Cabinet.class);
		Cabinet cabinet3 = mock(Cabinet.class);

		CabinetDto cabinetDto1 = mock(CabinetDto.class);
		CabinetDto cabinetDto2 = mock(CabinetDto.class);
		CabinetDto cabinetDto3 = mock(CabinetDto.class);

		Page<Cabinet> cabinets = new PageImpl<>(Arrays.asList(cabinet1, cabinet2, cabinet3));
		given(cabinetOptionalFetcher.findPaginationByStatus(cabinetStatus, pageRequest))
				.willReturn(cabinets);

		given(cabinetMapper.toCabinetDto(cabinet1)).willReturn(cabinetDto1);
		given(cabinetMapper.toCabinetDto(cabinet2)).willReturn(cabinetDto2);
		given(cabinetMapper.toCabinetDto(cabinet3)).willReturn(cabinetDto3);

		List<CabinetDto> cabinetDtos = Arrays.asList(cabinetDto1, cabinetDto2, cabinetDto3);
		given(cabinetMapper.toCabinetPaginationDtoList(cabinetDtos, cabinets.getTotalElements()))
				.willReturn(new CabinetPaginationDto(cabinetDtos, cabinets.getTotalElements()));

		// when
		CabinetPaginationDto result = cabinetFacadeService.getCabinetPaginationByStatus(
				cabinetStatus, page, size);

		then(cabinetOptionalFetcher).should().findPaginationByStatus(cabinetStatus, pageRequest);
		then(cabinetMapper).should(times(3)).toCabinetDto(any(Cabinet.class));
		then(cabinetMapper).should()
				.toCabinetPaginationDtoList(cabinetDtos, cabinets.getTotalElements());

		assertEquals(cabinets.getTotalElements(), result.getTotalLength());
		assertEquals(cabinetDtos, result.getResult());
	}


	@Test
	@DisplayName("성공: 캐비넷 상태로 찾은 캐비넷 정보 없음 (캐비넷 고장 상태)")
	void 성공_NULL_getCabinetPaginationByStatus() {
		Integer page = 0;
		Integer size = 5;
		CabinetStatus cabinetStatus = CabinetStatus.BROKEN;
		PageRequest pageRequest = PageRequest.of(page, size);

		given(cabinetOptionalFetcher.findPaginationByStatus(cabinetStatus, pageRequest))
				.willReturn(Page.empty());
		// when
		CabinetPaginationDto result = cabinetFacadeService.getCabinetPaginationByStatus(
				cabinetStatus, page, size);

		then(cabinetOptionalFetcher).should().findPaginationByStatus(cabinetStatus, pageRequest);
		assertNull(result);
	}

	@Test
	@DisplayName("성공: 캐비넷 visibleNum(가시 번호)으로 찾은 캐비넷 결과")
	void 성공_getCabinetPaginationByVisibleNum() {
		Integer page = 0;
		Integer size = 5;
		Integer visibleNum = 1;
		PageRequest pageRequest = PageRequest.of(page, size);

		Cabinet cabinet1 = mock(Cabinet.class);
		Cabinet cabinet2 = mock(Cabinet.class);
		Cabinet cabinet3 = mock(Cabinet.class);

		CabinetDto cabinetDto1 = mock(CabinetDto.class);
		CabinetDto cabinetDto2 = mock(CabinetDto.class);
		CabinetDto cabinetDto3 = mock(CabinetDto.class);

		Page<Cabinet> cabinets = new PageImpl<>(Arrays.asList(cabinet1, cabinet2, cabinet3));
		given(cabinetOptionalFetcher.findPaginationByVisibleNum(visibleNum, pageRequest))
				.willReturn(cabinets);

		given(cabinetMapper.toCabinetDto(cabinet1)).willReturn(cabinetDto1);
		given(cabinetMapper.toCabinetDto(cabinet2)).willReturn(cabinetDto2);
		given(cabinetMapper.toCabinetDto(cabinet3)).willReturn(cabinetDto3);

		List<CabinetDto> cabinetDtos = Arrays.asList(cabinetDto1, cabinetDto2, cabinetDto3);
		given(cabinetMapper.toCabinetPaginationDtoList(cabinetDtos, cabinets.getTotalElements()))
				.willReturn(new CabinetPaginationDto(cabinetDtos, cabinets.getTotalElements()));

		// when
		CabinetPaginationDto result = cabinetFacadeService
				.getCabinetPaginationByVisibleNum(visibleNum, page, size);

		then(cabinetOptionalFetcher).should().findPaginationByVisibleNum(visibleNum, pageRequest);
		then(cabinetMapper).should(times(3)).toCabinetDto(any(Cabinet.class));
		then(cabinetMapper).should()
				.toCabinetPaginationDtoList(cabinetDtos, cabinets.getTotalElements());

		assertEquals(cabinets.getTotalElements(), result.getTotalLength());
		assertEquals(cabinetDtos, result.getResult());
	}

	@Test
	@DisplayName("성공: 캐비넷 visibleNum(가시 번호)으로 찾은 캐비넷 정보 없음 ")
	void 성공_NULL_getCabinetPaginationByVisibleNum() {
		Integer page = 0;
		Integer size = 5;
		Integer visibleNum = 1;
		PageRequest pageRequest = PageRequest.of(page, size);

		given(cabinetOptionalFetcher.findPaginationByVisibleNum(visibleNum, pageRequest))
				.willReturn(Page.empty());
		// when
		CabinetPaginationDto result = cabinetFacadeService
				.getCabinetPaginationByVisibleNum(visibleNum, page, size);

		then(cabinetOptionalFetcher).should().findPaginationByVisibleNum(visibleNum, pageRequest);
		assertNull(result);
	}

	@Test
	@DisplayName("성공: 캐비넷 대여기록 캐비넷id 로 내림차순 페이징 조회")
	void 성공_getCabinetLentHistoriesPagination() {
		Long cabinetId = 999L;
		Integer page = 0;
		Integer size = 5;
		PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "startedAt"));

		LentHistory lentHistory1 = mock(LentHistory.class);
		LentHistory lentHistory2 = mock(LentHistory.class);
		LentHistory lentHistory3 = mock(LentHistory.class);
		Page<LentHistory> lentHistories = new PageImpl<>(
				Arrays.asList(lentHistory1, lentHistory2, lentHistory3));
		given(lentOptionalFetcher.findPaginationByCabinetId(cabinetId, pageRequest))
				.willReturn(lentHistories);

		LentHistoryDto lentHistoryDto1 = mock(LentHistoryDto.class);
		LentHistoryDto lentHistoryDto2 = mock(LentHistoryDto.class);
		LentHistoryDto lentHistoryDto3 = mock(LentHistoryDto.class);
		List<LentHistoryDto> generateLentHistoryDtoListResult = Arrays.asList(lentHistoryDto1,
				lentHistoryDto2, lentHistoryDto3);

		given(lentMapper.toLentHistoryPaginationDto(generateLentHistoryDtoListResult,
				lentHistories.getTotalElements()))
				.willReturn(new LentHistoryPaginationDto(generateLentHistoryDtoListResult,
						lentHistories.getTotalElements()));

		given(lentMapper.toLentHistoryDto(lentHistory1, lentHistory1.getUser(),
				lentHistory1.getCabinet()))
				.willReturn(lentHistoryDto1);
		given(lentMapper.toLentHistoryDto(lentHistory2, lentHistory2.getUser(),
				lentHistory2.getCabinet()))
				.willReturn(lentHistoryDto2);
		given(lentMapper.toLentHistoryDto(lentHistory3, lentHistory3.getUser(),
				lentHistory3.getCabinet()))
				.willReturn(lentHistoryDto3);

		// when
		LentHistoryPaginationDto result = cabinetFacadeService
				.getCabinetLentHistoriesPagination(cabinetId, page, size);

		then(lentOptionalFetcher).should().findPaginationByCabinetId(cabinetId, pageRequest);
		then(lentMapper).should().toLentHistoryPaginationDto(generateLentHistoryDtoListResult,
				lentHistories.getTotalElements());
		then(lentMapper).should(times(3))
				.toLentHistoryDto(any(), any(), any());

		assertEquals(result.getTotalLength(), lentHistories.getTotalElements());
		assertEquals(result.getResult(), generateLentHistoryDtoListResult);
	}

	@Test
	@DisplayName("성공: 캐비넷 대여기록 캐비넷id 로 내림차순 페이징 조회 - 조회결과 없음")
	void 성공_NULL_getCabinetLentHistoriesPagination() {
		Long cabinetId = 999L;
		Integer page = 0;
		Integer size = 5;
		PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "startedAt"));

		given(lentOptionalFetcher.findPaginationByCabinetId(cabinetId, pageRequest))
				.willReturn(Page.empty());

		// when
		LentHistoryPaginationDto result = cabinetFacadeService
				.getCabinetLentHistoriesPagination(cabinetId, page, size);
		then(lentOptionalFetcher).should().findPaginationByCabinetId(cabinetId, pageRequest);

		assertNull(result);
	}

	@Test
	@DisplayName("성공: 사물함 id로 사물함 정보 벌크 조회")
	void 성공_getCabinetInfoBundle() {

	}

	@Test
	@DisplayName("성공: 사물함 id 조회결과 없음")
	void 성공_NULL_getCabinetInfoBundle() {
		List<Long> cabinetIds = Arrays.asList(-1L, -2L, -3L, -4L, -5L);

		CabinetInfoResponseDto cabinetInfoResponseDto = new CabinetInfoResponseDto(null, null, null,
				null, null, null, null, null, null);

		given(cabinetFacadeService.getCabinetInfo(cabinetIds.get(0))).willReturn(cabinetInfoResponseDto);
		given(cabinetFacadeService.getCabinetInfo(cabinetIds.get(1))).willReturn(cabinetInfoResponseDto);
		given(cabinetFacadeService.getCabinetInfo(cabinetIds.get(2))).willReturn(cabinetInfoResponseDto);
		given(cabinetFacadeService.getCabinetInfo(cabinetIds.get(3))).willReturn(cabinetInfoResponseDto);
		given(cabinetFacadeService.getCabinetInfo(cabinetIds.get(4))).willReturn(cabinetInfoResponseDto);

		List<CabinetInfoResponseDto> result = cabinetFacadeService.getCabinetInfoBundle(
				cabinetIds);

		assertEquals(result, new ArrayList<>());
	}

	@Test
	@DisplayName("성공: 사물함 id로 사물함 정보 조회,")
	void 성공_getCabinetsInfo() {
		Long cabinetId = 998L;

		Cabinet cabinet = mock(Cabinet.class);

		LentHistory lentHistory1 = mock(LentHistory.class);
		LentHistory lentHistory2 = mock(LentHistory.class);
		LentHistory lentHistory3 = mock(LentHistory.class);
		given(lentHistory1.getUser()).willReturn(mock(User.class));
		given(lentHistory2.getUser()).willReturn(mock(User.class));
		given(lentHistory3.getUser()).willReturn(mock(User.class));
		List<LentHistory> lentHistories = Arrays.asList(lentHistory1, lentHistory2, lentHistory3);

		LentDto lentDto1 = mock(LentDto.class);
		LentDto lentDto2 = mock(LentDto.class);
		LentDto lentDto3 = mock(LentDto.class);

		given(lentOptionalFetcher.findAllActiveLentByCabinetId(cabinetId)).willReturn(
				lentHistories);

		given(lentMapper.toLentDto(lentHistory1.getUser(), lentHistory1)).willReturn(lentDto1);
		given(lentMapper.toLentDto(lentHistory2.getUser(), lentHistory2)).willReturn(lentDto2);
		given(lentMapper.toLentDto(lentHistory3.getUser(), lentHistory3)).willReturn(lentDto3);

		given(cabinetOptionalFetcher.findCabinet(cabinetId)).willReturn(cabinet);
		List<LentDto> lentDtos = Arrays.asList(lentDto1, lentDto2, lentDto3);
		given(cabinetMapper.toCabinetInfoResponseDto(cabinet, lentDtos))
				.willReturn(mock(CabinetInfoResponseDto.class));

		// when
		cabinetFacadeService.getCabinetInfo(cabinetId);

		then(lentOptionalFetcher).should().findAllActiveLentByCabinetId(cabinetId);
		then(lentMapper).should().toLentDto(lentHistory1.getUser(), lentHistory1);
		then(lentMapper).should().toLentDto(lentHistory2.getUser(), lentHistory2);
		then(lentMapper).should().toLentDto(lentHistory3.getUser(), lentHistory3);
		then(cabinetMapper).should().toCabinetInfoResponseDto(cabinet, lentDtos);
	}

	@Test
	@DisplayName("성공: 사물함 id로 사물함 정보 조회, 대여기록 없음")
	void 성공_NULL_getCabinetsInfo() {
		Long cabinetId = -1L;
		given(lentOptionalFetcher.findAllActiveLentByCabinetId(cabinetId)).willReturn(
				new ArrayList<>());
		given(cabinetMapper.toCabinetInfoResponseDto(any(Cabinet.class), anyList()))
				.willReturn(
						new CabinetInfoResponseDto(null, null, null, null, null, null, null, null,
								null)
				);
		// when
		CabinetInfoResponseDto result = cabinetFacadeService.getCabinetInfo(cabinetId);

		then(lentOptionalFetcher).should().findAllActiveLentByCabinetId(cabinetId);
		then(cabinetMapper).should().toCabinetInfoResponseDto(any(), any());
		assertNull(result);
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