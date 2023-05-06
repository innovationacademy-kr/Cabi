package org.ftclub.cabinet.cabinet.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.exception.ServiceException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

// service가 갖는 모든 메서드들을 유닛 테스트 합니다.
@SpringBootTest
@Transactional
class CabinetServiceTest {

	@Autowired
	private CabinetService cabinetService;

	@Test
	public void 사물함_가져오기() {
		Cabinet cabinet = cabinetService.getCabinet(1L);
		assertEquals(1L, cabinet.getCabinetId().longValue());
	}

	@Test
	public void 사물함_상태_업데이트() {
		Long brokenId = 1L;
		CabinetStatus newStatus = CabinetStatus.AVAILABLE;

		cabinetService.updateStatus(1L, newStatus);

		Cabinet updatedCabinet = cabinetService.getCabinet(brokenId);
		assertEquals(newStatus, updatedCabinet.getStatus());
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

	@Test
	public void 사물함_메모_업데이트() {
		Long brokenId = 1L;
		String newMemo = "YOOH 최고존엄 신 그 자체.";

		cabinetService.updateMemo(1L, newMemo);

		Cabinet updatedCabinet = cabinetService.getCabinet(brokenId);
		assertEquals(newMemo, updatedCabinet.getMemo());
	}

	@Test
	public void 사물함_실물번호_업데이트() {
		Long brokenId = 1L;
		cabinetService.updateVisibleNum(1L, 22);

		Cabinet updatedCabinet = cabinetService.getCabinet(brokenId);
		assertEquals(22, updatedCabinet.getVisibleNum().intValue());
	}

	@Test
	public void 사물함_제목_업데이트() {
		Long brokenId = 1L;
		String newTitle = "이것은 입에서 나는 소리가 아니여";

		cabinetService.updateTitle(1L, newTitle);

		Cabinet updatedCabinet = cabinetService.getCabinet(brokenId);
		assertEquals(newTitle, updatedCabinet.getTitle());
	}

	@Test
	public void 사물함_최대_사용자_수_업데이트() {
		Long brokenId = 1L;
		Integer newMaxUser = 42;

		cabinetService.updateMaxUser(1L, newMaxUser);

		Cabinet updatedCabinet = cabinetService.getCabinet(brokenId);
		assertEquals(newMaxUser, updatedCabinet.getMaxUser());
	}

	@Test
	public void 사물함_좌표_업데이트() {
		Long brokenId = 1L;
		Cabinet cabinet = cabinetService.getCabinet(brokenId);
		Grid newGrid = new Grid(42, 99);
		cabinetService.updateGrid(1L, newGrid);

		Cabinet updatedCabinet = cabinetService.getCabinet(brokenId);
		assertEquals(42, updatedCabinet.getGrid().getRow().intValue());
		assertEquals(99, updatedCabinet.getGrid().getCol().intValue());
	}

	@Test
	public void 사물함_좌표_업데이트_실패() {
		Grid newGrid = new Grid(-1, -42);

		assertThrows(ServiceException.class, () -> {
			cabinetService.updateGrid(1L, newGrid);
		});
	}

	@Test
	public void 사물함_상태_노트_업데이트() {
		Long brokenId = 1L;
		String newStatusNote = "나는 붕괴됐어요";

		cabinetService.updateStatusNote(1L, newStatusNote);

		Cabinet updatedCabinet = cabinetService.getCabinet(brokenId);
		assertEquals(newStatusNote, updatedCabinet.getStatusNote());
	}
}
