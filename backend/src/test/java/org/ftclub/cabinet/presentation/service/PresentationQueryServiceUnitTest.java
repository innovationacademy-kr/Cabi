package org.ftclub.cabinet.presentation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PresentationQueryServiceUnitTest {

	@Mock
	private PresentationRepository mockPresentationRepository;
	@InjectMocks
	private PresentationQueryService presentationQueryService;

	@Test
	@DisplayName("특정 연월의 프레젠테이션 목록 조회 시, 올바른 기간을 설정하여 호출하고 결과를 반환한다.")
	void getPresentationListByYearMonth_성공() {
		// given
		YearMonth yearMonth = YearMonth.of(2025, 5);
		LocalDateTime expectedStartDate = LocalDateTime.of(2025, 5, 1, 0, 0);
		LocalDateTime expectedEndDate = LocalDateTime.of(2025, 6, 1, 0, 0);

		// mock presentation
		Presentation mockPresentation1 = mock(Presentation.class);
		Presentation mockPresentation2 = mock(Presentation.class);
		List<Presentation> mockPresentations = List.of(mockPresentation1, mockPresentation2);

		given(mockPresentationRepository.findAllWithinPeriod(expectedStartDate, expectedEndDate))
				.willReturn(mockPresentations);

		// when
		List<Presentation> results = presentationQueryService.getPresentationByYearMonth(yearMonth);

		// then
		// 1. findAllWithinPeriod 함수가 expected dates로 호출되었는지 확인
		verify(mockPresentationRepository).findAllWithinPeriod(expectedStartDate, expectedEndDate);
		// 2. 결과가 mockPresentations와 일치하는지 확인
		assertThat(results).isEqualTo(mockPresentations);
		assertThat(results.size()).isEqualTo(2);
	}

	@Test
	@DisplayName("데이터가 없는 연월의 프레젠테이션 목록 조회 시, 빈 리스트를 반환한다.")
	void getPresentationEmptyListByYearMonth_성공() {
		// given
		YearMonth yearMonth = YearMonth.of(2025, 7);
		LocalDateTime expectedStartDate = LocalDateTime.of(2025, 7, 1, 0, 0);
		LocalDateTime expectedEndDate = LocalDateTime.of(2025, 8, 1, 0, 0);

		given(mockPresentationRepository.findAllWithinPeriod(expectedStartDate, expectedEndDate))
				.willReturn(List.of());

		// when
		List<Presentation> results = presentationQueryService.getPresentationByYearMonth(yearMonth);

		// then
		verify(mockPresentationRepository).findAllWithinPeriod(expectedStartDate, expectedEndDate);
		assertThat(results).isEmpty();
	}

}
