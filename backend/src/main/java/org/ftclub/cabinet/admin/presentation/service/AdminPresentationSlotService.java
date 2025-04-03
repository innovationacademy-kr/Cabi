package org.ftclub.cabinet.admin.presentation.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminPresentationSlotServiceDto;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 어드민이 프레젠테이션 슬롯을 관리하는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class AdminPresentationSlotService {

	static final int PRESENTATION_SLOT_DURATION = 2; // 발표 슬롯의 길이 (시간 단위)

	private final PresentationSlotRepository slotRepository;

	/**
	 * 어드민이 프레젠테이션 슬롯을 등록합니다.
	 *
	 * @param serviceDto 프레젠테이션 슬롯 정보
	 */
	public void registerPresentationSlot(AdminPresentationSlotServiceDto serviceDto) {
		checkSlotPassed(serviceDto);
		checkSlotOverlapped(serviceDto);
		slotRepository.save(new PresentationSlot(
				serviceDto.getStartTime(),
				serviceDto.getLocation()
		));
	}

	private void checkSlotPassed(AdminPresentationSlotServiceDto serviceDto) {
		if (serviceDto.getStartTime().isBefore(java.time.LocalDateTime.now())) {
			throw new RuntimeException("이미 지나간 시간입니다."); // todo : 예외 처리 해야함
		}
	}

	private void checkSlotOverlapped(AdminPresentationSlotServiceDto serviceDto) {
		List<PresentationSlot> overlappingSlots = slotRepository.findOverlappingSlots(
				serviceDto.getStartTime().minusHours(PRESENTATION_SLOT_DURATION),
				serviceDto.getStartTime().plusHours(PRESENTATION_SLOT_DURATION));
		if (!overlappingSlots.isEmpty()) {
			throw new RuntimeException("해당 시간에 이미 발표가 등록되어 있습니다."); // todo : 예외 처리 해야함
		}
	}
}
