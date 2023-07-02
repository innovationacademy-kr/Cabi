package org.ftclub.cabinet.statistics.service;

import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@SpringBootTest
@Transactional
class StatisticsFacadeServiceTest {

    @Autowired
    private StatisticsFacadeService statisticsFacadeService;

    @Test
    @DisplayName("대여와 반납 개수 세기 테스트")
    public void 대여_반납_개수_세기() {
        LentRepository lentRepository = mock(LentRepository.class);

        LocalDateTime startDate = LocalDateTime.of(2023, 1, 1, 0, 0); // 2023-01-01
        LocalDateTime endDate = LocalDateTime.of(2023, 6, 1, 0, 0); // 2023-06-01

        when(lentRepository.countLentByTimeDuration(startDate, endDate))
                .thenReturn(12);

        when(lentRepository.countLentByReturnTimeBetween(startDate, endDate))
                .thenReturn(2);

        LentsStatisticsResponseDto lentsStatisticsResponseDto = new LentsStatisticsResponseDto(startDate, endDate, 12, 2);
        assertThat(statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate)
                .getLentStartCount()).isEqualTo(lentsStatisticsResponseDto.getLentStartCount());

        assertThat(statisticsFacadeService.getCountOnLentAndReturn(startDate, endDate)
                .getLentEndCount()).isEqualTo(lentsStatisticsResponseDto.getLentEndCount());
    }
}
