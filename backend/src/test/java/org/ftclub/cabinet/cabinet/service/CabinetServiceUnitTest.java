package org.ftclub.cabinet.cabinet.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.exception.ExceptionStatus;
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
		Long cabinetId = 999L;
		Cabinet cabinet = mock(Cabinet.class);
		given(cabinetOptionalFetcher.getCabinet(cabinetId)).willReturn(cabinet);

		assertEquals(cabinet, cabinetService.getCabinet(cabinetId));

		then(cabinetOptionalFetcher).should().getCabinet(cabinetId);
	}

	@Test
	@DisplayName("실패: cabinetId에 해당하는 캐비넷이 없음.")
	void 실패_INVALID_CABINET_ID_getCabinet() {
		Long invalidCabinetId = -1L;
		given(cabinetOptionalFetcher.getCabinet(invalidCabinetId)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));

		assertThrows(ServiceException.class, () -> cabinetService.getCabinet(-1L));

		then(cabinetOptionalFetcher).should().getCabinet(invalidCabinetId);
	}

	@Test
	@DisplayName("성공: userId에 해당하는 캐비넷을 가져온다 ")
	void 성공_getLentCabinetByUserId() {
		Long cabinetId = 100L;
		Cabinet cabinet = mock(Cabinet.class);
		given(cabinetOptionalFetcher.getLentCabinetByUserId(cabinetId)).willReturn(cabinet);

		assertEquals(cabinet, cabinetService.getLentCabinetByUserId(cabinetId));

		then(cabinetOptionalFetcher).should().getLentCabinetByUserId(cabinetId);
	}

	@Test
	@DisplayName("실패: userId에 해당하는 캐비넷이 없음 ")
	void 실패_IVALID_USER_ID_getLentCabinetByUserId() {
		Long invalidCabinetId = -1L;
		given(cabinetOptionalFetcher.getLentCabinetByUserId(invalidCabinetId)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));

		assertThrows(ServiceException.class,
				() -> cabinetService.getLentCabinetByUserId(invalidCabinetId));
		then(cabinetOptionalFetcher).should().getLentCabinetByUserId(invalidCabinetId);
	}


	@Test
	@DisplayName("성공: 캐비넷 상태 변경")
	void 성공_updateStatus() {

		Long cabinetId = 999L;
		Cabinet cabinet = mock(Cabinet.class);
		CabinetStatus cabinetStatus = CabinetStatus.AVAILABLE;
		given(cabinetOptionalFetcher.getCabinet(cabinetId)).willReturn(cabinet);
		given(cabinet.getStatus()).willReturn(cabinetStatus);

		cabinetService.updateStatus(cabinetId, cabinetStatus);

		then(cabinetOptionalFetcher).should().getCabinet(cabinetId);
		then(cabinet).should().specifyStatus(cabinetStatus);
		assertEquals(cabinetStatus, cabinet.getStatus());
	}

	@Test
	@DisplayName("실패: 잘못된 cabinetId로 캐비넷 상태 변경 시도")
	void 실패_INVALID_CABINET_ID_updateStatus() {

		Long invalidCabinetId = -1L;
		given(cabinetOptionalFetcher.getCabinet(invalidCabinetId)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));

		assertThrows(ServiceException.class,
				() -> cabinetService.updateStatus(invalidCabinetId, CabinetStatus.AVAILABLE));

		then(cabinetOptionalFetcher).should().getCabinet(invalidCabinetId);
	}

	@Test
	@DisplayName("실패: 잘못된 cabinetId 로 메모 변경 시도")
	void 실패_INVALID_CABINET_ID_updateMemo() {
		Long invalidCabinetId = -1L;
		given(cabinetOptionalFetcher.getCabinet(invalidCabinetId)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));

		assertThrows(ServiceException.class,
				() -> cabinetService.updateMemo(invalidCabinetId, null));

		then(cabinetOptionalFetcher).should().getCabinet(invalidCabinetId);
	}


	@Test
	@DisplayName("성공: 캐비넷 메모 변경")
	void 성공_updateMemo() {
		Long cabinetId = 999L;
		String memo = "4885";

		Cabinet cabinet = mock(Cabinet.class);
		given(cabinet.getMemo()).willReturn(memo);
		given(cabinetOptionalFetcher.getCabinet(cabinetId)).willReturn(cabinet);

		cabinetService.updateMemo(cabinetId, memo);

		then(cabinetOptionalFetcher).should().getCabinet(cabinetId);
		then(cabinet).should().writeMemo(memo);
		assertEquals(memo, cabinet.getMemo());
	}

	@Test
	@DisplayName("실패: 잘못된 cabinetId로 캐비넷 visibleNum 변경 시도")
	void 실패_INVALID_CABINET_ID_updateVisibleNum() {
		Long invalidCabinetId = -1L;
		Integer visibleNum = 1;

		given(cabinetOptionalFetcher.getCabinet(invalidCabinetId)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));

		assertThrows(ServiceException.class,
				() -> cabinetService.updateVisibleNum(invalidCabinetId, visibleNum));

		then(cabinetOptionalFetcher).should().getCabinet(invalidCabinetId);
	}

	@Test
	@DisplayName("실패: 잘못된 visibleNum 으로 캐비넷 변경 시도")
	void 실패_INVALID_VISIBLE_NUM_updateVisibleNum() {
		Integer invalidVisibleNum = -1;

		assertThrows(ServiceException.class,
				() -> cabinetService.updateVisibleNum(null, invalidVisibleNum));
	}

	@Test
	@DisplayName("성공: 캐비넷 visibleNum 변경")
	void 성공_updateVisibleNum() {
		Long cabinetId = 999L;
		Integer visibleNum = 1;

		Cabinet cabinet = mock(Cabinet.class);
		given(cabinet.getVisibleNum()).willReturn(visibleNum);
		given(cabinetOptionalFetcher.getCabinet(cabinetId)).willReturn(cabinet);

		cabinetService.updateVisibleNum(cabinetId, visibleNum);

		then(cabinetOptionalFetcher).should().getCabinet(cabinetId);
		then(cabinet).should().assignVisibleNum(visibleNum);
		assertEquals(visibleNum, cabinet.getVisibleNum());
	}

	@Test
	@DisplayName("실패: 잘못된 cabinetId로 캐비넷 제목 변경 시도")
	void 실패_IVALID_CABINET_ID_updateTitle() {
		Long invalidCabinetId = -1L;

		given(cabinetOptionalFetcher.getCabinet(invalidCabinetId)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));

		assertThrows(ServiceException.class,
				() -> cabinetService.updateTitle(invalidCabinetId, null));

		then(cabinetOptionalFetcher).should().getCabinet(invalidCabinetId);
	}

	@Test
	@DisplayName("성공: 캐비넷 제목 변경")
	void 성공_updateTitle() {
		Long cabinetId = 999L;
		String title = "테스트같이할사람_너만오면고";

		Cabinet cabinet = mock(Cabinet.class);
		given(cabinet.getTitle()).willReturn(title);
		given(cabinetOptionalFetcher.getCabinet(cabinetId)).willReturn(cabinet);

		cabinetService.updateTitle(cabinetId, title);

		then(cabinetOptionalFetcher).should().getCabinet(cabinetId);
		then(cabinet).should().writeTitle(title);
		assertEquals(title, cabinet.getTitle());
	}

	@Test
	@DisplayName("실패: 잘못된 cabinetId로 캐비넷 제목과 메모 변경 시도")
	void 실패_INVALID_CABINET_ID_updateTitleAndMemo() {
		Long invalidCabinetId = -1L;

		given(cabinetOptionalFetcher.getCabinet(invalidCabinetId)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));

		assertThrows(ServiceException.class,
				() -> cabinetService.updateTitleAndMemo(invalidCabinetId, null, null));

		then(cabinetOptionalFetcher).should().getCabinet(invalidCabinetId);
	}

	@Test
	@DisplayName("성공: 제목, 메모 둘다 NULL - 변경사항 없음")
	void 성공_NOTHING_CHANGES_NULL_updateTitleAndMemo() {
		Long cabinetId = 999L;

		Cabinet cabinet = mock(Cabinet.class);
		given(cabinetOptionalFetcher.getCabinet(cabinetId)).willReturn(cabinet);

		cabinetService.updateTitleAndMemo(cabinetId, null, null);

		then(cabinetOptionalFetcher).should().getCabinet(cabinetId);
		then(cabinet).should(times(0)).writeTitle(any());
		then(cabinet).should(times(0)).writeMemo(any());
	}

	@Test
	@DisplayName("성공: 제목, 메모 둘다 빈 문자열 - 변경사항 없음")
	void 성공_NOTHING_CHANGES_EMPTY_updateTitleAndMemo() {
		Long cabinetId = 999L;

		Cabinet cabinet = mock(Cabinet.class);
		given(cabinetOptionalFetcher.getCabinet(cabinetId)).willReturn(cabinet);

		cabinetService.updateTitleAndMemo(cabinetId, "", "");

		then(cabinetOptionalFetcher).should().getCabinet(cabinetId);
		then(cabinet).should(times(0)).writeTitle(any());
		then(cabinet).should(times(0)).writeMemo(any());
	}

	@Test
	@DisplayName("성공: 캐비넷 제목 null - 메모만 변경")
	void 성공_CHANGE_ONLY_MEMO_TITLE_NULL_updateTitleAndMemo() {
		Long cabinetId = 999L;
		String memo = "1577-1577";

		Cabinet cabinet = mock(Cabinet.class);
		given(cabinet.getMemo()).willReturn(memo);
		given(cabinetOptionalFetcher.getCabinet(cabinetId)).willReturn(cabinet);

		cabinetService.updateTitleAndMemo(cabinetId, null, memo);

		then(cabinetOptionalFetcher).should().getCabinet(cabinetId);
		then(cabinet).should(times(0)).writeTitle(any());
		then(cabinet).should().writeMemo(memo);
		assertEquals(memo, cabinet.getMemo());
	}

	@Test
	@DisplayName("성공: 캐비넷 제목 빈 문자열 - 메모만 변경")
	void 성공_CHANGE_ONLY_MEMO_TITLE_EMPTY_updateTitleAndMemo() {
		Long cabinetId = 999L;
		String memo = "1577-1577";

		Cabinet cabinet = mock(Cabinet.class);
		given(cabinet.getMemo()).willReturn(memo);
		given(cabinetOptionalFetcher.getCabinet(cabinetId)).willReturn(cabinet);

		cabinetService.updateTitleAndMemo(cabinetId, "", memo);

		then(cabinetOptionalFetcher).should().getCabinet(cabinetId);
		then(cabinet).should(times(0)).writeTitle(any());
		then(cabinet).should().writeMemo(memo);
		assertEquals(memo, cabinet.getMemo());
	}

	@Test
	@DisplayName("성공: 캐비넷 메모 null - 제목만 변경")
	void 성공_CHANGE_ONLY_TITLE_MEMO_NULL_updateTitleAndMemo() {
		Long cabinetId = 999L;
		String title = "1577-1577";

		Cabinet cabinet = mock(Cabinet.class);
		given(cabinet.getTitle()).willReturn(title);
		given(cabinetOptionalFetcher.getCabinet(cabinetId)).willReturn(cabinet);

		cabinetService.updateTitleAndMemo(cabinetId, title, null);

		then(cabinetOptionalFetcher).should().getCabinet(cabinetId);
		then(cabinet).should(times(0)).writeMemo(any());
		then(cabinet).should().writeTitle(title);
		assertEquals(title, cabinet.getTitle());
	}

	@Test
	@DisplayName("성공: 캐비넷 메모 null - 제목만 변경")
	void 성공_CHANGE_ONLY_TITLE_MEMO_EMPTY_updateTitleAndMemo() {
		Long cabinetId = 999L;
		String title = "1577-1577";

		Cabinet cabinet = mock(Cabinet.class);
		given(cabinet.getTitle()).willReturn(title);
		given(cabinetOptionalFetcher.getCabinet(cabinetId)).willReturn(cabinet);

		cabinetService.updateTitleAndMemo(cabinetId, title, "");

		then(cabinetOptionalFetcher).should().getCabinet(cabinetId);
		then(cabinet).should(times(0)).writeMemo(any());
		then(cabinet).should().writeTitle(title);
		assertEquals(title, cabinet.getTitle());
	}



	@Test
	@DisplayName("성공: 캐비넷 제목과 메모 변경")
	void 성공_updateTitleAndMemo() {
		Long cabinetId = 999L;
		String title = "앞뒤가 똑같은 전화번호";
		String memo = "1577-1577";

		Cabinet cabinet = mock(Cabinet.class);
		given(cabinet.getTitle()).willReturn(title);
		given(cabinet.getMemo()).willReturn(memo);
		given(cabinetOptionalFetcher.getCabinet(cabinetId)).willReturn(cabinet);

		cabinetService.updateTitleAndMemo(cabinetId, title, memo);

		then(cabinetOptionalFetcher).should().getCabinet(cabinetId);
		then(cabinet).should().writeTitle(title);
		then(cabinet).should().writeMemo(memo);
		assertEquals(title, cabinet.getTitle());
		assertEquals(memo, cabinet.getMemo());
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