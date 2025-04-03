package org.ftclub.cabinet.admin.presentation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDateTime;
import org.ftclub.cabinet.admin.dto.AdminPresentationSlotServiceDto;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AdminPresentationSlotServiceTest {

	@Autowired
	private PresentationSlotRepository slotRepository;

	@Autowired
	private AdminPresentationSlotService slotService;

	@DisplayName("어드민이 프레젠테이션 슬롯을 생성하여 등록한다.")
	@Test
	void registerPresentationSlot() {
		// given
		AdminPresentationSlotServiceDto slotServiceDto = new AdminPresentationSlotServiceDto(
				LocalDateTime.now().plusHours(1),
				PresentationLocation.BASEMENT
		);

		// when
		slotService.registerPresentationSlot(slotServiceDto);

		// then
		PresentationSlot savedSlot = slotRepository.findAll().get(0);
		assertThat(savedSlot).isNotNull();
		assertThat(savedSlot.getPresentationLocation()).isEqualTo(PresentationLocation.BASEMENT);
		assertThat(savedSlot.getStartTime()).isEqualTo(slotServiceDto.getStartTime());
	}

	@DisplayName("등록하려는 슬롯의 시간이 현재 기준으로 과거일 수 없다.")
	@Test
	void registerPresentationSlotWithPastTime() {
		// given
		AdminPresentationSlotServiceDto slotServiceDto = new AdminPresentationSlotServiceDto(
				LocalDateTime.now().minusHours(1),
				PresentationLocation.BASEMENT
		);

		// then
		assertThatThrownBy(() -> slotService.registerPresentationSlot(slotServiceDto))
				.isInstanceOf(RuntimeException.class); // todo : 예외 처리 하면 바꿀것
	}

	@DisplayName("시간대가 겹치는 슬롯이 있으면 슬롯을 등록할 수 없다.")
	@Test
	void registerPresentationSlotWithOverlappingTime() {
		// given
		LocalDateTime now = LocalDateTime.now();

		AdminPresentationSlotServiceDto slotServiceDto1 = new AdminPresentationSlotServiceDto(
				now.plusHours(1),
				PresentationLocation.BASEMENT
		);
		slotService.registerPresentationSlot(slotServiceDto1);

		AdminPresentationSlotServiceDto slotServiceDto2 = new AdminPresentationSlotServiceDto(
				now.plusHours(2),
				PresentationLocation.BASEMENT
		);

		// then
		assertThatThrownBy(() -> slotService.registerPresentationSlot(slotServiceDto2))
				.isInstanceOf(RuntimeException.class); // todo : 예외 처리 하면 바꿀것
	}
}