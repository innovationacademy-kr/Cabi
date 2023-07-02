package org.ftclub.cabinet.statistics.controller;

import org.ftclub.cabinet.statistics.service.StatisticsFacadeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.*;

@WebMvcTest
@ExtendWith(MockitoExtension.class)
public class StatisticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    StatisticsFacadeService statisticsFacadeService;

    @Test
    @DisplayName("모든층의 사물함 통계 가져오기")
    public void 모든층의_사물함_통계_가져오기() {
        StatisticsFacadeService statisticsFacadeService = mock(StatisticsFacadeService.class);

        verify(statisticsFacadeService).getCabinetsCountOnAllFloors();
    }
}
