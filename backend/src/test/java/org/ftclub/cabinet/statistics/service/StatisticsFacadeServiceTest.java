package org.ftclub.cabinet.statistics.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.mock;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.EqualsAndHashCode;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.CabinetFloorStatisticsResponseDto;
import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.statistics.repository.StatisticsRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@EqualsAndHashCode
class StatisticsFacadeServiceTest {

	@Mock(lenient = false) // lenient = false: mock 객체의 메서드가 호출되지 않았을 때 예외를 발생시킴
	private StatisticsRepository statisticsRepository = mock(StatisticsRepository.class);

	@Mock(lenient = false)
	private CabinetRepository cabinetRepository = mock(CabinetRepository.class);

	@Mock(lenient = false)
	private LentRepository lentRepository = mock(LentRepository.class);

	@InjectMocks
	private StatisticsFacadeServiceImpl statisticsFacadeService;

	@Test
	@DisplayName("모든_층의_사물함_통계_가져오기 성공 테스트")
	public void 모든_층의_사물함_통계_가져오기_성공() {
		given(statisticsRepository.getCabinetsCountByStatus(any(), any()))
				.willReturn(10);
		given(cabinetRepository.findAllFloorsByBuilding(any()))
				.willReturn(Optional.of(List.of(2, 3, 4, 5)));
		given(statisticsRepository.getAvailableCabinetsId(any()))
				.willReturn(List.of(1L, 2L, 3L, 4L, 5L));
		given(lentRepository.countCabinetActiveLent(any()))
				.willReturn(1);

		List<CabinetFloorStatisticsResponseDto> cabinetFloorStatisticsResponseDtos = new ArrayList<>();
		for (Integer i = 2; i <= 5; i++) {
			cabinetFloorStatisticsResponseDtos.add(
					new CabinetFloorStatisticsResponseDto(i, 30, 15, 10, 0, 10));
		}
		for (Integer i = 0; i <= 3; i++) {
			assertThat(statisticsFacadeService.getCabinetsCountOnAllFloors().get(i).getTotal())
					.isEqualTo(cabinetFloorStatisticsResponseDtos.get(i).getTotal());
			assertThat(statisticsFacadeService.getCabinetsCountOnAllFloors().get(i).getUsed())
					.isEqualTo(cabinetFloorStatisticsResponseDtos.get(i).getUsed());
			assertThat(statisticsFacadeService.getCabinetsCountOnAllFloors().get(i).getOverdue())
					.isEqualTo(cabinetFloorStatisticsResponseDtos.get(i).getOverdue());
			assertThat(statisticsFacadeService.getCabinetsCountOnAllFloors().get(i).getUnused())
					.isEqualTo(cabinetFloorStatisticsResponseDtos.get(i).getUnused());
			assertThat(statisticsFacadeService.getCabinetsCountOnAllFloors().get(i).getDisabled())
					.isEqualTo(cabinetFloorStatisticsResponseDtos.get(i).getDisabled());
		}
	}

	/**
	 * 모든 층의 사물함 통계 가져오기 실패 케이스에 대한 테스트는 생략 -> getCabinetsCountOnAllFloors는 인자를 따로 받지 않고
	 * repository에서 필요한 값들을 가져온 후 조회하기 때문에 실패 케이스가 존재하지 않음
	 */

	@Test
	@DisplayName("대여와 반납 개수 세기 성공 테스트")
	public void 대여_반납_개수_세기_성공() {
		LocalDateTime startDate = LocalDateTime.of(2023, 1, 1, 0, 0); // 2023-01-01
		LocalDateTime endDate = LocalDateTime.of(2023, 6, 1, 0, 0); // 2023-06-01

		given(lentRepository.countLentByTimeDuration(startDate, endDate))
				.willReturn(12);
		given(lentRepository.countReturnByTimeDuration(startDate, endDate))
				.willReturn(2);

		LentsStatisticsResponseDto lentsStatisticsResponseDto = new LentsStatisticsResponseDto(
				startDate, endDate, 12, 2);
		assertThat(statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate)
				.getLentStartCount()).isEqualTo(lentsStatisticsResponseDto.getLentStartCount());
		assertThat(statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate)
				.getLentEndCount()).isEqualTo(lentsStatisticsResponseDto.getLentEndCount());
	}
}
