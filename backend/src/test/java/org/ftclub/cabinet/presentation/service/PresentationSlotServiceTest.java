package org.ftclub.cabinet.presentation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.ftclub.cabinet.presentation.domain.PresentationLocation.BASEMENT;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import org.ftclub.cabinet.dto.AvailablePresentationSlotDto;
import org.ftclub.cabinet.event.RedisExpirationEventListener;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.dto.DataListResponseDto;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class PresentationSlotServiceTest {

	@Autowired
	private PresentationSlotService presentationSlotService;

	@Autowired
	private PresentationSlotRepository presentationSlotRepository;

	@Autowired
	private PresentationRepository presentationRepository;

	@MockBean
	private RedisExpirationEventListener redisExpirationEventListener;

	@MockBean
	private Clock clock;

	@BeforeEach
	void setUp() {
		presentationRepository.deleteAllInBatch();
		presentationSlotRepository.deleteAllInBatch();
	}

	@DisplayName("현재시간 기준으로 3개월 안의 예약되지 않은 슬롯을 조회한다")
	@Test
	void test() {
		// given
		LocalDateTime fixedNow = LocalDateTime.of(2025, 7, 10, 15, 0, 0);
		Instant instant = fixedNow.atZone(ZoneId.systemDefault()).toInstant();
		when(clock.instant()).thenReturn(instant);
		when(clock.getZone()).thenReturn(ZoneId.systemDefault());

		PresentationSlot slot1 = new PresentationSlot(fixedNow.minusDays(1), BASEMENT);
		PresentationSlot slot2 = new PresentationSlot(fixedNow.plusMonths(1), BASEMENT);
		PresentationSlot slot3 = new PresentationSlot(fixedNow.plusMonths(2), BASEMENT);
		PresentationSlot slot4 = new PresentationSlot(fixedNow.plusMonths(3), BASEMENT);

		presentationSlotRepository.saveAll(List.of(slot1, slot2, slot3, slot4));
		// when

		DataListResponseDto<AvailablePresentationSlotDto> slots = presentationSlotService.getPresentationSlots();

		// then
		assertThat(slots).isNotNull();
		assertThat(slots.getData()).extracting(AvailablePresentationSlotDto::getStartTime)
				.containsExactlyInAnyOrder(
						slot2.getStartTime(),
						slot3.getStartTime()
				);
	}

}