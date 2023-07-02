package org.ftclub.cabinet.statistics.service;

import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

//@WebMvcTest
@SpringBootTest
@Transactional
//@ExtendWith(MockitoExtension.class)
class StatisticsFacadeServiceTest {

//    // datagrip db 문제로 보류...
//    @Test
//    @DisplayName("모든층의 사물한 가져오기 테스트")
//    public List<CabinetFloorStatisticsResponseDto> 모든층의_사물함_정보_가져오기() {
//        List<CabinetFloorStatisticsResponseDto> cabinetFloorStatisticsResponseDtos = new ArrayList<>();
//
//        given(statisticsFacadeService.getCabinetsCountOnAllFloors()).willReturn(
//                cabinetFloorStatisticsResponseDtos.add(new CabinetFloorStatisticsResponseDto(2, total, used, overdue, unused, disabled)),
//                cabinetFloorStatisticsResponseDtos.add(new CabinetFloorStatisticsResponseDto(3, total, used, overdue, unused, disabled)),
//                cabinetFloorStatisticsResponseDtos.add(new CabinetFloorStatisticsResponseDto(4, total, used, overdue, unused, disabled)),
//                cabinetFloorStatisticsResponseDtos.add(new CabinetFloorStatisticsResponseDto(5, total, used, overdue, unused, disabled))
//                );
//    }

    @Autowired
    private StatisticsFacadeService statisticsFacadeService;

    @Test
    @DisplayName("대여와 반납 개수 세기 테스트")
    public void 대여_반납_개수_세기() {
        LentRepository lentRepository = mock(LentRepository.class);

        Date startDate = new Date(); // 2023-01-01
        Date endDate = new Date(); // 2023-06-01

        startDate.setYear(2023 - 1900); // Date 타입의 기본 year가 1900이므로 빼줘야 정상 설정됨
        startDate.setMonth(0); // 1월
        startDate.setDate(1);

        endDate.setYear(2023 - 1900); // Date 타입의 기본 year가 1900이므로 빼줘야 정상 설정됨
        endDate.setMonth(5); // 6월
        endDate.setDate(1);

//        given(statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate)).willReturn(
//                new LentsStatisticsResponseDto(startDate, endDate, 12, 2)
//        );

//        assertThat(statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate)).isSameAs(
//                given(statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate)).willReturn(
//                        new LentsStatisticsResponseDto(startDate, endDate, 12, 2)
//                ));

//        LentsStatisticsResponseDto lentsStatisticsResponseDto = new LentsStatisticsResponseDto(startDate, endDate, 12, 2);

        when(lentRepository.countLentByLentTimeBetween(startDate, endDate))
                .thenReturn(12);

        when(lentRepository.countLentByReturnTimeBetween(startDate, endDate))
                .thenReturn(2);

//        assertThat(statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate).getLentStartCount()).isEqualTo(12);
//        assertThat(statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate).getLentEndCount()).isEqualTo(2);

        LentsStatisticsResponseDto lentsStatisticsResponseDto = new LentsStatisticsResponseDto(startDate, endDate, 12, 2);
        assertThat(statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate)
                .getLentStartCount()).isEqualTo(lentsStatisticsResponseDto.getLentStartCount());

        assertThat(statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate)
                .getLentEndCount()).isEqualTo(lentsStatisticsResponseDto.getLentEndCount());
    }
}
