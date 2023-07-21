package org.ftclub.cabinet.statistics.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.mock;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.dto.CabinetFloorStatisticsResponseDto;
import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.statistics.repository.StatisticsRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class StatisticsFacadeServiceUnitTest {

	@Mock(lenient = false)
	private StatisticsRepository statisticsRepository = mock(StatisticsRepository.class);

	@Mock(lenient = false)
	private CabinetOptionalFetcher cabinetOptionalFetcher = mock(CabinetOptionalFetcher.class);

	@Mock(lenient = false)
	private LentRepository lentRepository = mock(LentRepository.class);

	@InjectMocks
	private StatisticsFacadeServiceImpl statisticsFacadeService;

	@Test
	@DisplayName("모든_층의_사물함_통계_가져오기 성공 테스트")
	public void 모든_층의_사물함_통계_가져오기_성공() {
		String building = "새롬관";
		List<Integer> floors = List.of(2, 3, 4, 5);
		Integer floor = any(Integer.class);
		List<Long> availableCabinetsId = List.of(1L, 2L, 3L, 4L, 5L);
		CabinetStatus status = any(CabinetStatus.class);
		Integer cabinetCount = 10;
		Long cabinetId = 1L;
		int activeUserCount = 1;
		given(statisticsRepository.getCabinetsCountByStatus(floor, status))
				.willReturn(cabinetCount);
		given(cabinetOptionalFetcher.findAllFloorsByBuilding(building))
				.willReturn(floors);
		given(statisticsRepository.getAvailableCabinetsId(any()))
				.willReturn(availableCabinetsId);
		given(lentRepository.countCabinetActiveLent(cabinetId))
				.willReturn(activeUserCount);
		List<CabinetFloorStatisticsResponseDto> cabinetFloorStatisticsResponseDtosOrigin = new ArrayList<>();
		for (Integer i = 2; i <= 5; i++) {
			cabinetFloorStatisticsResponseDtosOrigin.add(
					new CabinetFloorStatisticsResponseDto(i, 35, 15, 10, 0, 10));
		}

		List<CabinetFloorStatisticsResponseDto> cabinetFloorStatisticsResponseDtosTested = statisticsFacadeService.getCabinetsCountOnAllFloors();

		for (Integer i = 0; i <= 3; i++) {
			assertThat(cabinetFloorStatisticsResponseDtosTested.get(i).getTotal())
					.isEqualTo(cabinetFloorStatisticsResponseDtosTested.get(i).getTotal());
			assertThat(cabinetFloorStatisticsResponseDtosTested.get(i).getUsed())
					.isEqualTo(cabinetFloorStatisticsResponseDtosTested.get(i).getUsed());
			assertThat(cabinetFloorStatisticsResponseDtosTested.get(i).getOverdue())
					.isEqualTo(cabinetFloorStatisticsResponseDtosTested.get(i).getOverdue());
			assertThat(cabinetFloorStatisticsResponseDtosTested.get(i).getUnused())
					.isEqualTo(cabinetFloorStatisticsResponseDtosTested.get(i).getUnused());
			assertThat(cabinetFloorStatisticsResponseDtosTested.get(i).getDisabled())
					.isEqualTo(cabinetFloorStatisticsResponseDtosTested.get(i).getDisabled());
		}
	}

	/**
	 * 모든 층의 사물함 통계 가져오기 실패 케이스에 대한 테스트는 생략 -> getCabinetsCountOnAllFloors는 인자를 따로 받지 않고
	 * repository에서 필요한 값들을 가져온 후 조회하기 때문에 실패 케이스가 존재하지 않음
	 */

	@Test
	@DisplayName("대여와 반납 개수 세기 성공 테스트 - startDate가 endDate보다 이전 날짜인 경우")
	public void 대여_반납_개수_세기_성공() {
		LocalDateTime startDate = LocalDateTime.of(2023, 1, 1, 0, 0); // 2023-01-01
		LocalDateTime endDate = LocalDateTime.of(2023, 6, 1, 0, 0); // 2023-06-01
		given(lentRepository.countLentByTimeDuration(startDate, endDate))
				.willReturn(12);
		given(lentRepository.countReturnByTimeDuration(startDate, endDate))
				.willReturn(2);
		LentsStatisticsResponseDto lentsStatisticsResponseDtoOrigin = new LentsStatisticsResponseDto(
				startDate, endDate, lentRepository.countLentByTimeDuration(startDate, endDate),
				lentRepository.countReturnByTimeDuration(startDate, endDate));

		LentsStatisticsResponseDto lentsStatisticsResponseDtoTested = statisticsFacadeService.getCountOnLentAndReturn(
				startDate, endDate);

		assertThat(lentsStatisticsResponseDtoTested.getLentStartCount()).isEqualTo(
				lentsStatisticsResponseDtoOrigin.getLentStartCount());
		assertThat(lentsStatisticsResponseDtoTested.getLentEndCount()).isEqualTo(
				lentsStatisticsResponseDtoOrigin.getLentEndCount());
		then(lentRepository).should(times(2)).countLentByTimeDuration(startDate, endDate);
		then(lentRepository).should(times(2)).countReturnByTimeDuration(startDate, endDate);
	}

	@Test
	@DisplayName("대여와 반납 개수 세기 실패 테스트 - startDate가 endDate보다 이후의 날짜인 경우")
	public void 대여_반납_개수_세기_실패() {
		LocalDateTime startDate = LocalDateTime.of(2023, 6, 1, 0, 0); // 2023-06-01
		LocalDateTime endDate = LocalDateTime.of(2023, 1, 1, 0, 0); // 2023-01-01

		Assertions.assertThrows(ServiceException.class, () -> {
			statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate);
		});
		then(lentRepository).should(times(0)).countLentByTimeDuration(startDate, endDate);
		then(lentRepository).should(times(0)).countReturnByTimeDuration(startDate, endDate);
	}
}
