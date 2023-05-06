//package org.ftclub.cabinet.cabinet.service;
//
//import static org.junit.Assert.assertArrayEquals;
//import static org.junit.Assert.assertEquals;
//
//import java.util.List;
//import javax.transaction.Transactional;
//import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
//import org.ftclub.cabinet.cabinet.domain.LentType;
//import org.ftclub.cabinet.cabinet.domain.Location;
//import org.ftclub.cabinet.dto.BuildingFloorsDto;
//import org.ftclub.cabinet.dto.CabinetDto;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//@SpringBootTest
//@Transactional
//public class CabinetFacadeServiceTest {
//
//	@Autowired
//	private CabinetFacadeService cabinetFacadeService;
//
//	@Test
//	public void 사물함_Dto_가져오기() {
//		Long brokenId = 1L;
//		CabinetDto cabinet = cabinetFacadeService.getCabinetInfo(brokenId);
//
//		assertEquals(1L, cabinet.getCabinetId().longValue());
//		assertEquals(CabinetStatus.BROKEN, cabinet.getStatus());
//		assertEquals(1, cabinet.getMaxUser().intValue());
//		assertEquals(LentType.PRIVATE, cabinet.getLentType());
//		assertEquals(1, cabinet.getVisibleNum().intValue());
//		assertEquals(new Location("새롬관", 2, "Oasis"), cabinet.getLocation());
////        assertEquals(1, cabinet.getTitle());
//	}
//
//	@Test
//	public void 건물_층_가져오기() {
//		List<BuildingFloorsDto> buildingFloors = cabinetService.getBuildingFloors()
//				.getBuildingFloors();
//		//새롬관
//		assertEquals(1, buildingFloors.size());
//		//2, 3, 4, 5층
//		assertArrayEquals(new Integer[]{2, 3, 4, 5},
//				buildingFloors.get(0).getFloors().toArray());
//	}
//
//	@Test
//	public void 사물함_정보_가져오기() {
//		Long fullShareCabinetId = 4L;
//		CabinetInfoResponseDto cabinetInfo = cabinetFacadeService.getCabinetInfo(
//				fullShareCabinetId);
//		List<LentDto> lentsOfCabinet = cabinetInfo.getLents();
//
//		//3인
//		//To-Do : 더 구체적인 정보 테스트 필요..
//		assertEquals(3, lentsOfCabinet.size());
//		assertEquals(15L, lentsOfCabinet.get(0).getUserId().longValue());
//		assertEquals("user7", lentsOfCabinet.get(0).getName());
//	}
//}
