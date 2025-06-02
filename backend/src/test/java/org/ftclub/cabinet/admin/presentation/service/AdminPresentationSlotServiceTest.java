package org.ftclub.cabinet.admin.presentation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.admin.dto.PresentationSlotRegisterServiceDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotResponseDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotSearchServiceDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotUpdateServiceDto;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class AdminPresentationSlotServiceTest {

	@Autowired
	private PresentationSlotRepository slotRepository;

	@Autowired
	private AdminPresentationSlotService slotService;

	@Autowired
	private PresentationRepository presentationRepository;

	@MockBean
	private UserRepository userRepository;

	private User testUser1;

	@BeforeEach
	void setUp() {
		User userToSave1 = User.of("jongmlee", "jongmlee@gmail.com",
				LocalDateTime.now().plusMonths(10),
				"MEMBER");
		when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
			User userArg = invocation.getArgument(0);
			if (userArg.getId() == null) { // ID가 아직 없는 새 엔티티라면
				ReflectionTestUtils.setField(userArg, "id", 1L); // 임의의 ID (testUser1 용)
			}
			return userArg;
		});
		testUser1 = userRepository.save(userToSave1);
	}

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

	@DisplayName("어드민이 프레젠테이션 슬롯을 2시간 간격으로 연속하여 등록한다")
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
				now.plusHours(3),
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
				now.plusHours(2),
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
						now.plusHours(2),
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

	@DisplayName("어드민이 특정 월에 포함되는 슬롯중에 프레젠테이션이 지정되지 않는 슬롯을 조회한다.")
	@Test
	void getAvailableSlots() {
		// given
		LocalDateTime now = LocalDateTime.now();
		PresentationSlotRegisterServiceDto slotServiceDto1 = new PresentationSlotRegisterServiceDto(
				now.plusHours(1),
				PresentationLocation.THIRD
		);
		slotService.registerPresentationSlot(slotServiceDto1);

		PresentationSlotRegisterServiceDto slotServiceDto2 = new PresentationSlotRegisterServiceDto(
				now.plusHours(3),
				PresentationLocation.BASEMENT
		);
		slotService.registerPresentationSlot(slotServiceDto2);

		PresentationSlot slot1 = slotRepository.findAll().get(0);

		Presentation presentation = Presentation.of(testUser1, Category.ETC,
				Duration.TWO_HOUR, "test", "test", "test", "test",
				null, false, false, slot1);

		presentationRepository.save(presentation);

		slot1.assignPresentation(presentation);

		// when
		int year = now.getYear();
		int month = now.getMonthValue();
		List<PresentationSlotResponseDto> slots = slotService.getAvailableSlots(
				new PresentationSlotSearchServiceDto(year, month, "AVAILABLE"));

		// then
		assertThat(slots.size()).isEqualTo(1);
		assertThat(slots.get(0).getStartTime()).isEqualTo(now.plusHours(3));
		assertThat(slots.get(0).getLocation()).isEqualTo(PresentationLocation.BASEMENT);
	}

	@DisplayName("과거 시점으로는 슬롯을 조회할 수 없다.")
	@Test
	void cannotCreateSlotPast() {
		// given
		LocalDateTime now = LocalDateTime.now();
		int currentMonth = now.minusMonths(1).getMonthValue();

		slotRepository.save(new PresentationSlot(
				now.minusMonths(1),
				PresentationLocation.BASEMENT
		));

		// 조회 DTO 생성
		PresentationSlotSearchServiceDto pastSearchDto = new PresentationSlotSearchServiceDto(
				now.minusMonths(1).getYear(),
				currentMonth,
				"available"
		);

		// when & then
		assertThatThrownBy(() -> slotService.getAvailableSlots(pastSearchDto))
				.isInstanceOf(ServiceException.class)
				.hasMessage("과거 슬롯은 조회할 수 없습니다.");
	}

	@DisplayName("슬롯이 과거가 아니고 허용된 기간 내이며 발표가 없으면 등록 유효성 검사를 통과한다.")
	@Test
	void validateSlotEligibleForRegistration_success() {
		// given
		LocalDateTime validTime = LocalDateTime.now().plusMonths(1);
		PresentationSlot slot = slotRepository.save(new PresentationSlot(
				validTime,
				PresentationLocation.BASEMENT
		));

		// when & then
		assertThatCode(() -> slotService.validateSlotEligibleForRegistration(slot.getId()))
				.doesNotThrowAnyException();
	}

	@DisplayName("슬롯이 과거이면 등록 유효성 검사에 실패한다.")
	@Test
	void validateSlotEligibleForRegistration_withPastTime() {
		// given
		LocalDateTime pastTime = LocalDateTime.now().minusDays(1);
		PresentationSlot slot = slotRepository.save(new PresentationSlot(
				pastTime,
				PresentationLocation.BASEMENT
		));

		// when & then
		assertThatThrownBy(() -> slotService.validateSlotEligibleForRegistration(slot.getId()))
				.isInstanceOf(ServiceException.class)
				.hasMessage("과거 시간으로는 발표 슬롯을 생성할 수 없습니다.");
	}

	@DisplayName("슬롯이 허용된 기간 이후이면 등록 유효성 검사에 실패한다.")
	@Test
	void validateSlotEligibleForRegistration_outsideAllowedPeriod() {
		// given
		LocalDateTime tooFar = LocalDateTime.now().plusMonths(3);
		PresentationSlot slot = slotRepository.save(new PresentationSlot(
				tooFar,
				PresentationLocation.BASEMENT
		));

		// when & then
		assertThatThrownBy(() -> slotService.validateSlotEligibleForRegistration(slot.getId()))
				.isInstanceOf(ServiceException.class)
				.hasMessage("허용된 기간 외의 슬롯은 존재할 수 없습니다.");
	}

	@DisplayName("슬롯에 프레젠테이션이 이미 존재하면 등록 유효성 검사에 실패한다.")
	@Test
	void validateSlotEligibleForRegistration_withPresentation() {
		// given
		LocalDateTime validTime = LocalDateTime.now().plusDays(1);
		PresentationSlot slot = slotRepository.save(new PresentationSlot(
				validTime,
				PresentationLocation.BASEMENT
		));

		Presentation presentation = Presentation.of(testUser1, Category.ETC,
				Duration.TWO_HOUR, "test", "test", "test", "test",
				null, false, false, slot);

		presentationRepository.save(presentation);
		slot.assignPresentation(presentation);

		// when & then
		assertThatThrownBy(() -> slotService.validateSlotEligibleForRegistration(slot.getId()))
				.isInstanceOf(ServiceException.class)
				.hasMessage("발표가 있는 슬롯은 삭제할 수 없습니다.");
	}
}