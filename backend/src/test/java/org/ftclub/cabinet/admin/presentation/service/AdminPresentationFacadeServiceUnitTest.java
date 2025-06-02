package org.ftclub.cabinet.admin.presentation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import java.time.YearMonth;
import java.util.List;
import org.ftclub.cabinet.admin.dto.AdminPresentationCalendarItemDto;
import org.ftclub.cabinet.mapper.PresentationMapper;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.service.PresentationQueryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AdminPresentationFacadeServiceUnitTest {

	@Mock
	private PresentationQueryService mockPresentationQueryService;
	@Mock
	private PresentationMapper mockPresentationMapper;
	@InjectMocks
	private AdminPresentationFacadeService adminPresentationFacadeService;

	@Test
	@DisplayName("특정 연월의 프레젠테이션 목록 조회 시 해당하는 발표에 대한 DTO 리스트가 반환된다.")
	void getPresentationListByYearMonth_성공() {
		// given
		YearMonth yearMonth = YearMonth.of(2025, 5);
		Presentation mockPresentation1 = mock(Presentation.class);
		Presentation mockPresentation2 = mock(Presentation.class);

		List<Presentation> mockPresentations = List.of(mockPresentation1, mockPresentation2);
		given(mockPresentationQueryService.findPresentationsByYearMonth(yearMonth))
				.willReturn(mockPresentations);

		// mock responseDto and mapper
		AdminPresentationCalendarItemDto mockResponseDto1 = mock(
				AdminPresentationCalendarItemDto.class);
		AdminPresentationCalendarItemDto mockResponseDto2 = mock(
				AdminPresentationCalendarItemDto.class);

		given(mockPresentationMapper.toAdminPresentationCalendarItemDto(mockPresentation1))
				.willReturn(mockResponseDto1);
		given(mockPresentationMapper.toAdminPresentationCalendarItemDto(mockPresentation2))
				.willReturn(mockResponseDto2);

		// when
		List<AdminPresentationCalendarItemDto> results =
				adminPresentationFacadeService.getPresentationsByYearMonth(yearMonth);

		// then
		assertThat(results).isNotNull();
		assertThat(results.size()).isEqualTo(2);
		assertThat(results).containsExactly(mockResponseDto1, mockResponseDto2);
	}

	@Test
	@DisplayName("데이터가 없는 연월의 프레젠테이션 목록 조회 시, 빈 리스트를 반환한다.")
	void getPresentationEmptyListByYearMonth_성공() {
		// given
		YearMonth yearMonth = YearMonth.of(2025, 7);
		List<Presentation> mockPresentations = List.of();

		given(mockPresentationQueryService.findPresentationsByYearMonth(yearMonth))
				.willReturn(mockPresentations);

		// when
		List<AdminPresentationCalendarItemDto> results =
				adminPresentationFacadeService.getPresentationsByYearMonth(yearMonth);

		// then
		assertThat(results).isNotNull();
		assertThat(results.size()).isEqualTo(0);
	}

}
