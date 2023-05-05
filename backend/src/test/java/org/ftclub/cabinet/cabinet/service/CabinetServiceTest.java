package org.ftclub.cabinet.cabinet.service;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.exception.ServiceException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;


@SpringBootTest
@Transactional
class CabinetServiceTest {

	@Autowired
	private CabinetService cabinetService;

	@Test
	public void 사물함_Dto_가져오기() {
		Long brokenId = 1L;
		CabinetDto cabinet = cabinetService.getCabinet(brokenId);

		assertEquals(1L, cabinet.getCabinetId().longValue());
		assertEquals(CabinetStatus.BROKEN, cabinet.getStatus());
		assertEquals(1, cabinet.getMaxUser().intValue());
		assertEquals(LentType.PRIVATE, cabinet.getLentType());
		assertEquals(1, cabinet.getVisibleNum().intValue());
		assertEquals(new Location("새롬관", 2, "Oasis"), cabinet.getLocation());
//        assertEquals(1, cabinet.getTitle());
	}

	@Test
	public void 건물_층_가져오기() {
		List<BuildingFloorsDto> buildingFloors = cabinetService.getBuildingFloors()
				.getBuildingFloors();
		//새롬관
		assertEquals(1, buildingFloors.size());
		//2, 3, 4, 5층
		assertArrayEquals(new Integer[]{2, 3, 4, 5},
				buildingFloors.get(0).getFloors().toArray());
	}

//	@Test
//	public void 사물함_정보_가져오기() {
//		Long fullShareCabinetId = 4L;
//		CabinetInfoResponseDto cabinetInfo = cabinetFacadeService.getCabinetInfo(fullShareCabinetId);
//		List<LentDto> lentsOfCabinet = cabinetInfo.getLents();
//
//		//3인
//		//To-Do : 더 구체적인 정보 테스트 필요..
//		assertEquals(3, lentsOfCabinet.size());
//		assertEquals(15L, lentsOfCabinet.get(0).getUserId().longValue());
//		assertEquals("user7", lentsOfCabinet.get(0).getName());
//	}

	@Test
	public void 사물함_상태_업데이트() {
		Long brokenId = 1L;
		Cabinet cabinet = cabinetService.getCabinet(brokenId);

		cabinetService.updateStatus(1L, CabinetStatus.AVAILABLE);

		Cabinet updatedCabinet = cabinetService.getCabinet(brokenId);
		assertEquals(CabinetStatus.AVAILABLE, updatedCabinet.getStatus());
	}

	@Test
	public void 불가능한_사물함_유저수_상태_업데이트() {
		Long brokenId = 1L;

		assertThrows(ServiceException.class, () -> {
			cabinetService.updateStatusByUserCount(brokenId, 0);
		});
	}

	@Test
	public void 공유_사물함_유저수_상태_업데이트() {
		Long fullId = 4L;
		Long overdueId = 6L;
		Long availableId = 8L;
		Long limitedAvailableId = 16L;

		cabinetService.updateStatusByUserCount(fullId, 2);
		cabinetService.updateStatusByUserCount(overdueId, 0);
		cabinetService.updateStatusByUserCount(availableId, 3);
		cabinetService.updateStatusByUserCount(limitedAvailableId, 0);

		// 3 -> 2
		assertEquals(cabinetService.getCabinet(fullId).getStatus(),
				CabinetStatus.LIMITED_AVAILABLE);
		// 0, 1, 2 -> 0
		assertEquals(cabinetService.getCabinet(overdueId).getStatus(),
				CabinetStatus.AVAILABLE);
		// 0, 1, 2 -> 3
		assertEquals(cabinetService.getCabinet(availableId).getStatus(),
				CabinetStatus.FULL);
		// 1 -> 0
		assertEquals(cabinetService.getCabinet(limitedAvailableId).getStatus(),
				CabinetStatus.AVAILABLE);
	}

	@Test
	public void 개인_사물함_유저수_상태_업데이트() {
		Long fullId = 3L;
		Long availableId = 7L;

		cabinetService.updateStatusByUserCount(fullId, 0);
		cabinetService.updateStatusByUserCount(availableId, 1);

		// 1 -> 0
		assertEquals(cabinetService.getCabinet(fullId).getStatus(),
				CabinetStatus.AVAILABLE);
		// 0 -> 1
		assertEquals(cabinetService.getCabinet(availableId).getStatus(),
				CabinetStatus.FULL);
	}

}
