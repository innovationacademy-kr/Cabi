package org.ftclub.cabinet.statistics.controller;

import static org.mockito.Mockito.mock;

import org.ftclub.cabinet.statistics.service.StatisticsFacadeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
//@EqualsAndHashCode
public class StatisticsControllerTest {

	@Mock
	private StatisticsFacadeService statisticsFacadeService = mock(StatisticsFacadeService.class);

	@InjectMocks
	private StatisticsController statisticsController;

	@Test
	@DisplayName("모든층의 사물함 통계 가져오기")
	public void 모든층의_사물함_통계_가져오기() {
		
	}
}
