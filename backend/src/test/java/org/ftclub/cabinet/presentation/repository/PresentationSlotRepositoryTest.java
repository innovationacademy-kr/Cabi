package org.ftclub.cabinet.presentation.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

@DataJpaTest
@Transactional
class PresentationSlotRepositoryTest {

	@Autowired
	private PresentationSlotRepository slotRepository;

	@DisplayName("프레젠테이션 슬롯을 저장하고 조회한다.")
	@Test
	void saveAndFindPresentationSlot() {
		// given
		PresentationSlot slot = new PresentationSlot(
				LocalDateTime.now().plusDays(1),
				PresentationLocation.BASEMENT
		);

		// when
		slotRepository.save(slot);
		PresentationSlot savedSlot = slotRepository.findAll().get(0);

		// then
		assertThat(savedSlot).isNotNull();
		assertThat(savedSlot.getPresentationLocation()).isEqualTo(PresentationLocation.BASEMENT);
		assertThat(savedSlot.getStartTime()).isEqualTo(slot.getStartTime());
	}

	@DisplayName("주어진 시간 범위와 겹치는 프레젠테이션 슬롯을 조회한다")
	@Test
	void findByStartTimeBetween() {
		// given
		LocalDateTime now = LocalDateTime.now();
		PresentationSlot slot1 = new PresentationSlot(now.minusHours(2),
				PresentationLocation.BASEMENT);
		PresentationSlot slot2 = new PresentationSlot(now.plusHours(2),
				PresentationLocation.BASEMENT);
		PresentationSlot slot3 = new PresentationSlot(now.plusHours(1),
				PresentationLocation.BASEMENT);
		slotRepository.saveAll(List.of(slot1, slot2, slot3));

		// when
		List<PresentationSlot> overlappingSlots = slotRepository.findByStartTimeBetween(
				now.minusHours(2),
				now.plusHours(2));

		// then
		assertThat(overlappingSlots).hasSize(1);
		assertThat(overlappingSlots.get(0).getStartTime()).isEqualTo(slot3.getStartTime());
	}
}