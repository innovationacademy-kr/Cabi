package org.ftclub.cabinet.admin.presentation.service;

import static org.ftclub.cabinet.presentation.domain.PresentationSlot.ALLOWED_PERIOD;
import static org.ftclub.cabinet.presentation.domain.PresentationSlot.PRESENTATION_SLOT_DURATION;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.PresentationSlotRegisterServiceDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotResponseDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotSearchServiceDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotUpdateServiceDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.ftclub.cabinet.presentation.service.PresentationCommandService;
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
	private final PresentationCommandService presentationCommandService;

	/**
	 * 프레젠테이션 슬롯이 허용된 기간 내에 있는지 확인합니다.
	 *
	 * @param startTime 시작 시간
	 */

	public void validateSlotWithinAllowedPeriod(LocalDateTime startTime) {
		YearMonth nowMonth = YearMonth.now();
		YearMonth allowedLimit = nowMonth.plusMonths(ALLOWED_PERIOD);
		YearMonth targetMonth = YearMonth.from(startTime);

		if (targetMonth.isAfter(allowedLimit.minusMonths(1))) {
			throw ExceptionStatus.NOT_ALLOWED_PERIOD.asServiceException();
		}
	}

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
				serviceDto.getPresentationLocation()
		));
	}

	/**
	 * 프레젠테이션 슬롯이 과거인지 확인합니다.
	 *
	 * @param startTime
	 */
	public void validateSlotPassed(LocalDateTime startTime) {
		if (startTime.isBefore(java.time.LocalDateTime.now())) {
			throw ExceptionStatus.CANNOT_CREATE_SLOT_IN_PAST.asServiceException();
		}
	}

	/**
	 * 프레젠테이션 슬롯이 겹치는지 확인합니다.
	 *
	 * @param startTime
	 */
	@Transactional(readOnly = true)
	public void validateSlotOverlapped(LocalDateTime startTime) {
		LocalDateTime overlapStartTime = startTime.minusMinutes(PRESENTATION_SLOT_DURATION);
		LocalDateTime overlapEndTime = startTime.plusMinutes(PRESENTATION_SLOT_DURATION);

		List<PresentationSlot> overlappingSlots = slotRepository.findByStartTimeBetween(
				overlapStartTime, overlapEndTime);

		if (!overlappingSlots.isEmpty()) {
			throw ExceptionStatus.SLOT_ALREADY_EXISTS.asServiceException();
		}
	}

	/**
	 * 프레젠테이션 슬롯이 겹치는지 확인합니다.
	 *
	 * @param slotId       슬롯 ID
	 * @param newStartTime 시작 시간
	 */
	@Transactional(readOnly = true)
	public void validateSlotUpdateOverlap(Long slotId, LocalDateTime newStartTime) {
		LocalDateTime overlapStartTime = newStartTime.minusMinutes(PRESENTATION_SLOT_DURATION);
		LocalDateTime overlapEndTime = newStartTime.plusMinutes(PRESENTATION_SLOT_DURATION);

		List<PresentationSlot> overlappingSlots = slotRepository.findByStartTimeBetween(
				overlapStartTime, overlapEndTime);

		if (overlappingSlots.size() > 1 ||
				(overlappingSlots.size() == 1 && !overlappingSlots.get(0).getId().equals(slotId))) {
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
		PresentationSlot slot = slotRepository.findById(serviceDto.getSlotId())
				.orElseThrow(ExceptionStatus.SLOT_NOT_FOUND::asServiceException);
		validateSlotPassed(serviceDto.getStartTime());
		validateSlotUpdateOverlap(serviceDto.getSlotId(), serviceDto.getStartTime());
		slot.changeSlotStartTime(serviceDto.getStartTime());
		slot.changeSlotLocation(serviceDto.getPresentationLocation());
		if (slot.hasPresentation()) {
			presentationCommandService.updateSlotDetails(slot.getPresentation().getId(),
					slot.getStartTime(), slot.getPresentationLocation());
		}
	}

	/**
	 * 프레젠테이션 슬롯을 삭제합니다.
	 *
	 * @param slotId 프레젠테이션 슬롯 ID
	 */
	public void deletePresentationSlot(Long slotId) {
		PresentationSlot slot = slotRepository.findById(slotId)
				.orElseThrow(ExceptionStatus.SLOT_NOT_FOUND::asServiceException);
		if (slot.hasPresentation()) {
			throw ExceptionStatus.CANNOT_DELETE_SLOT_WITH_PRESENTATION.asServiceException();
		}
		slotRepository.delete(slot);
	}

	/**
	 * 어드민이 프레젠테이션 슬롯을 조회합니다.
	 *
	 * @param slotSearchServiceDto 프레젠테이션 슬롯 조회 요청 DTO
	 * @return 프레젠테이션 슬롯 리스트
	 */
	public List<PresentationSlotResponseDto> getAvailableSlots(
			@Valid PresentationSlotSearchServiceDto slotSearchServiceDto) {

		int year = slotSearchServiceDto.getYear();
		int month = slotSearchServiceDto.getMonth();
		LocalDateTime now = LocalDateTime.now();

		// 만약 연도와 월이 과거라면 에러를 반환합니다.
		if (year < now.getYear() || (year == now.getYear() && month < now.getMonthValue())) {
			throw ExceptionStatus.CANNOT_SEARCH_PAST_SLOT.asServiceException();
		}

		// 조회할 월의 시작과 끝을 계산합니다.
		YearMonth targetMonth = YearMonth.of(year, month);
		LocalDateTime start = targetMonth.atDay(1).atStartOfDay();
		LocalDateTime end = targetMonth.plusMonths(1).atDay(1).atStartOfDay();

		// 주어진 월에 있는 슬롯을 전부 조회해서, 현재 날짜 이후이면서 발표가 없는 슬롯만 모아 List로 반환합니다.
		List<PresentationSlotResponseDto> responseDtoList = slotRepository.findByStartTimeBetween(
						start, end)
				.stream()
				.filter(slot -> slot.getStartTime().isAfter(now) && !slot.hasPresentation())
				.map(slot -> new PresentationSlotResponseDto(
						slot.getId(),
						slot.getStartTime(),
						slot.getPresentationLocation()
				)).collect(Collectors.toList());

		return responseDtoList;
	}

	/**
	 * 프레젠테이션 슬롯이 과거 시간인지, 허용된 기간 내에 있는지, 그리고 해당 슬롯에 발표가 있는지 확인합니다.
	 *
	 * @param slotId 프레젠테이션 슬롯 ID
	 */
	@Transactional(readOnly = true)
	public void validateSlotEligibleForRegistration(Long slotId) {
		PresentationSlot slot = slotRepository.findById(slotId).orElseThrow(
				ExceptionStatus.SLOT_NOT_FOUND::asServiceException);
		validateSlotPassed(slot.getStartTime());
		validateSlotWithinAllowedPeriod(slot.getStartTime());
		if (slot.hasPresentation()) {
			throw ExceptionStatus.CANNOT_DELETE_SLOT_WITH_PRESENTATION.asServiceException();
		}
	}
}
