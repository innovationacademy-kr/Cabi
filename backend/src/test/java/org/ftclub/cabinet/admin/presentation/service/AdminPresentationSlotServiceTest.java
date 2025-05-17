package org.ftclub.cabinet.admin.presentation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDateTime;
import org.ftclub.cabinet.admin.dto.PresentationSlotRegisterServiceDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotUpdateServiceDto;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.ftclub.cabinet.presentation.service.PresentationFacadeService;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class AdminPresentationSlotServiceTest {

	@Autowired
	private PresentationSlotRepository slotRepository;

	@Autowired
	private AdminPresentationSlotService slotService;

	@Autowired
	private PresentationFacadeService presentationFacadeService;

	@Autowired
	private UserFacadeService userFacadeService;

	@DisplayName("어드민이 프레젠테이션 슬롯을 생성하여 등록한다.")
	@Test
	void registerPresentationSlot() {
		// given
		PresentationSlotRegisterServiceDto slotServiceDto = new PresentationSlotRegisterServiceDto(
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

	@DisplayName("어드민이 프레젠테이션 슬롯을 30분 간격으로 연속하여 등록한다")
	@Test
	void registerTwoPresentationSlots() {
		// given
		LocalDateTime now = LocalDateTime.now();
		PresentationSlotRegisterServiceDto slotServiceDto1 = new PresentationSlotRegisterServiceDto(
				now.plusHours(1),
				PresentationLocation.BASEMENT
		);
		slotService.registerPresentationSlot(slotServiceDto1);

		PresentationSlotRegisterServiceDto slotServiceDto2 = new PresentationSlotRegisterServiceDto(
				now.plusHours(1).plusMinutes(30),
				PresentationLocation.BASEMENT
		);

		// when
		slotService.registerPresentationSlot(slotServiceDto2);

		// then
		assertThat(slotRepository.findAll().size()).isEqualTo(2);
	}

	@DisplayName("등록하려는 슬롯의 시간이 현재 기준으로 과거일 수 없다.")
	@Test
	void registerPresentationSlotWithPastTime() {
		// given
		PresentationSlotRegisterServiceDto slotServiceDto = new PresentationSlotRegisterServiceDto(
				LocalDateTime.now().minusHours(1),
				PresentationLocation.BASEMENT
		);

		// then
		assertThatThrownBy(() -> slotService.registerPresentationSlot(slotServiceDto))
				.isInstanceOf(ServiceException.class)
				.hasMessage("과거 시간으로는 발표 슬롯을 생성할 수 없습니다.");
	}

	@DisplayName("시간대가 겹치는 슬롯이 있으면 슬롯을 등록할 수 없다.")
	@Test
	void registerPresentationSlotWithOverlappingTime() {
		// given
		LocalDateTime now = LocalDateTime.now();

		PresentationSlotRegisterServiceDto slotServiceDto1 = new PresentationSlotRegisterServiceDto(
				now.plusHours(1),
				PresentationLocation.BASEMENT
		);
		slotService.registerPresentationSlot(slotServiceDto1);

		PresentationSlotRegisterServiceDto slotServiceDto2 = new PresentationSlotRegisterServiceDto(
				now.plusHours(1).plusMinutes(20),
				PresentationLocation.BASEMENT
		);

		// then
		assertThatThrownBy(() -> slotService.registerPresentationSlot(slotServiceDto2))
				.isInstanceOf(ServiceException.class)
				.hasMessage("해당 시간에는 이미 발표 슬롯이 존재합니다.");
	}

	@DisplayName("프레젠테이션 슬롯을 새로운 정보로 업데이트한다.")
	@Test
	void updatePresentationSlot() {
		// given
		LocalDateTime now = LocalDateTime.now();
		PresentationSlotRegisterServiceDto slotServiceDto1 = new PresentationSlotRegisterServiceDto(
				now.plusHours(3),
				PresentationLocation.BASEMENT
		);
		slotService.registerPresentationSlot(slotServiceDto1);

		Long slotId = slotRepository.findAll().get(0).getId();

		PresentationSlotRegisterServiceDto slotServiceDto2 = new PresentationSlotRegisterServiceDto(
				now.plusHours(5),
				PresentationLocation.BASEMENT
		);
		slotService.registerPresentationSlot(slotServiceDto2);

		// when
		slotService.updatePresentationSlot(new PresentationSlotUpdateServiceDto(
				slotId,
				now.plusHours(2),
				PresentationLocation.BASEMENT
		));

		// then
		assertThat(slotRepository.findById(slotId).get().getStartTime()).isEqualTo(
				now.plusHours(2));
	}

	@DisplayName("슬롯을 업데이트 하려는 시간이 과거일 수 없다.")
	@Test
	void updatePresentationSlotWithPastTime() {
		// given
		LocalDateTime now = LocalDateTime.now();
		PresentationSlotRegisterServiceDto slotServiceDto = new PresentationSlotRegisterServiceDto(
				now.plusHours(1),
				PresentationLocation.BASEMENT
		);
		slotService.registerPresentationSlot(slotServiceDto);

		Long slotId = slotRepository.findAll().get(0).getId();

		// then
		assertThatThrownBy(
				() -> slotService.updatePresentationSlot(new PresentationSlotUpdateServiceDto(
						slotId,
						now.minusHours(1),
						PresentationLocation.BASEMENT
				)))
				.isInstanceOf(ServiceException.class)
				.hasMessage("과거 시간으로는 발표 슬롯을 생성할 수 없습니다.");
	}

	@DisplayName("업데이트 하려는 슬롯의 시간이 겹치는 슬롯이 있으면 업데이트할 수 없다.")
	@Test
	void updatePresentationSlotWithOverlappingTime() {
		// given
		LocalDateTime now = LocalDateTime.now();
		PresentationSlotRegisterServiceDto slotServiceDto1 = new PresentationSlotRegisterServiceDto(
				now.plusHours(1),
				PresentationLocation.BASEMENT
		);
		slotService.registerPresentationSlot(slotServiceDto1);

		Long slotId = slotRepository.findAll().get(0).getId();

		PresentationSlotRegisterServiceDto slotServiceDto2 = new PresentationSlotRegisterServiceDto(
				now.plusHours(3),
				PresentationLocation.BASEMENT
		);
		slotService.registerPresentationSlot(slotServiceDto2);

		// then
		assertThatThrownBy(
				() -> slotService.updatePresentationSlot(new PresentationSlotUpdateServiceDto(
						slotId,
						now.plusHours(2).plusMinutes(40),
						PresentationLocation.BASEMENT
				)))
				.isInstanceOf(ServiceException.class)
				.hasMessage("해당 시간에는 이미 발표 슬롯이 존재합니다.");
	}

	@DisplayName("어드민이 프레젠테이션이 지정되지 않은 슬롯을 삭제한다.")
	@Test
	void deletePresentationSlot() {
		// given
		LocalDateTime now = LocalDateTime.now();
		PresentationSlotRegisterServiceDto slotServiceDto = new PresentationSlotRegisterServiceDto(
				now.plusHours(1),
				PresentationLocation.BASEMENT
		);
		slotService.registerPresentationSlot(slotServiceDto);

		Long slotId = slotRepository.findAll().get(0).getId();

		// when
		slotService.deletePresentationSlot(slotId);

		// then
		assertThat(slotRepository.findById(slotId)).isEmpty();
	}
}