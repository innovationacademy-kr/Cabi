package org.ftclub.cabinet.cabinet.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.exception.ServiceException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CabinetServiceUnitTest {

	@InjectMocks
	CabinetServiceImpl cabinetService;
	@Mock
	CabinetOptionalFetcher cabinetOptionalFetcher = mock(CabinetOptionalFetcher.class);

	@Test
	@DisplayName("성공: cabinetId에 해당하는 캐비넷을 가져온다.")
	void 성공_getCabinet() {
		Cabinet cabinet = mock(Cabinet.class);
		given(cabinetOptionalFetcher.getCabinet(999L)).willReturn(cabinet);

		assertEquals(cabinet, cabinetService.getCabinet(999L));
	}

	@Test
	@DisplayName("실패: cabinetId에 해당하는 캐비넷이 없음.")
	void 실패_INVALID_CABINET_ID_getCabinet() {
		given(cabinetOptionalFetcher.getCabinet(-1L)).willThrow(ServiceException.class);

		assertThrows(ServiceException.class, () -> cabinetService.getCabinet(-1L));
	}

	@Test
	@DisplayName("성공: userId에 해당하는 캐비넷을 가져온다 ")
	void 성공_getLentCabinetByUserId() {
		Cabinet cabinet = mock(Cabinet.class);
		given(cabinetOptionalFetcher.getLentCabinetByUserId(100L)).willReturn(cabinet);

		assertEquals(cabinet, cabinetService.getLentCabinetByUserId(100L));
	}

	@Test
	@DisplayName("실패: userId에 해당하는 캐비넷이 없음 ")
	void 실패_IVALID_USER_ID_getLentCabinetByUserId() {

		given(cabinetOptionalFetcher.getLentCabinetByUserId(-1L)).willThrow(ServiceException.class);

		assertThrows(ServiceException.class, () -> cabinetService.getLentCabinetByUserId(-1L));
	}


	@Test
	@DisplayName("성공: 잘못된 CabinetStatus")
	void 성공_INVALID_CABINET_STATUS_updateStatus() {
		CabinetStatus status;
		given(status.isValid()).willReturn(false);
		assertThrows(ServiceException.class, () -> cabinetService.updateStatus(null, status));
	}

	@Test
	void updateMemo() {
	}

	@Test
	void updateVisibleNum() {
	}

	@Test
	void updateTitle() {
	}

	@Test
	void updateTitleAndMemo() {
	}

	@Test
	void updateMaxUser() {
	}

	@Test
	void updateLentType() {
	}

	@Test
	void updateGrid() {
	}

	@Test
	void updateStatusNote() {
	}
}