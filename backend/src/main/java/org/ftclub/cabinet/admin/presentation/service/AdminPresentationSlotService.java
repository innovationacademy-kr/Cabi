package org.ftclub.cabinet.admin.presentation.service;

import static org.ftclub.cabinet.presentation.domain.PresentationSlot.PRESENTATION_SLOT_DURATION;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.PresentationSlotRegisterServiceDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotUpdateServiceDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
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

	private final PresentationSlotRepository slotRepository;

	/**
	 * 어드민이 프레젠테이션 슬롯을 등록합니다.
	 *
	 * @param serviceDto 프레젠테이션 슬롯 정보
	 */
	public void registerPresentationSlot(PresentationSlotRegisterServiceDto serviceDto) {
		validateSlotPassed(serviceDto.getStartTime());
		validateSlotOverlapped(serviceDto.getStartTime());
		slotRepository.save(new PresentationSlot(
				serviceDto.getStartTime(),
				serviceDto.getLocation()
		));
	}

	/**
	 * 프레젠테이션 슬롯이 과거인지 확인합니다.
	 *
	 * @param startTime
	 */
	private void validateSlotPassed(LocalDateTime startTime) {
		if (startTime.isBefore(java.time.LocalDateTime.now())) {
			throw ExceptionStatus.CANNOT_CREATE_SLOT_IN_PAST.asServiceException();
		}
	}

	/**
	 * 프레젠테이션 슬롯이 겹치는지 확인합니다.
	 *
	 * @param startTime
	 */
	private void validateSlotOverlapped(LocalDateTime startTime) {
		LocalDateTime overlapStartTime = startTime.minusHours(PRESENTATION_SLOT_DURATION);
		LocalDateTime overlapEndTime = startTime.plusHours(PRESENTATION_SLOT_DURATION);

		List<PresentationSlot> overlappingSlots = slotRepository.findByStartTimeBetween(
				overlapStartTime, overlapEndTime);

		if (!overlappingSlots.isEmpty()) {
			throw ExceptionStatus.SLOT_ALREADY_EXISTS.asServiceException();
		}
	}

	/**
	 * 프레젠테이션 슬롯을 업데이트합니다.
	 *
	 * @param serviceDto 프레젠테이션 슬롯 정보
	 */
	public void updatePresentationSlot(
			PresentationSlotUpdateServiceDto serviceDto) {

	}
}
