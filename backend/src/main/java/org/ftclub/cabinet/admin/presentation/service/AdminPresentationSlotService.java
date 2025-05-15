package org.ftclub.cabinet.admin.presentation.service;

import static org.ftclub.cabinet.presentation.domain.PresentationSlot.PRESENTATION_SLOT_DURATION;

import java.time.LocalDateTime;
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
	@Transactional(readOnly = true)
	public void validateSlotOverlapped(LocalDateTime startTime) {
		LocalDateTime overlapStartTime = startTime.minusHours(PRESENTATION_SLOT_DURATION);
		LocalDateTime overlapEndTime = startTime.plusHours(PRESENTATION_SLOT_DURATION);

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
		LocalDateTime overlapStartTime = newStartTime.minusHours(PRESENTATION_SLOT_DURATION);
		LocalDateTime overlapEndTime = newStartTime.plusHours(PRESENTATION_SLOT_DURATION);

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
		slot.changeSlotLocation(serviceDto.getLocation());
		// TODO : 프레젠테이션에 연결된 발표 정보도 수정해야 한다면 발표 수정 기능 개발 후에 추가
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

		// 주어진 월에 있는 슬롯을 전부 조회해서, 현재 날짜 이후이면서 발표가 없는 슬롯만 모아 List로 반환합니다.
		List<PresentationSlotResponseDto> responseDtoList = slotRepository.findByStartTimeBetween(
						LocalDateTime.of(year, month, 1, 0, 0),
						LocalDateTime.of(year, month + 1, 1, 0, 0)
				).stream().filter(slot -> slot.getStartTime().isAfter(now) && !slot.hasPresentation())
				.map(slot -> new PresentationSlotResponseDto(
						slot.getId(),
						slot.getStartTime(),
						slot.getPresentationLocation()
				)).collect(Collectors.toList());

		return responseDtoList;
	}


}
