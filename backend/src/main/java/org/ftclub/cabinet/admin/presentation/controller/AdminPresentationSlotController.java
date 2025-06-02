package org.ftclub.cabinet.admin.presentation.controller;

import java.time.YearMonth;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminPresentationSlotRequestDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotRegisterServiceDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotResponseDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotSearchServiceDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotUpdateServiceDto;
import org.ftclub.cabinet.admin.presentation.service.AdminPresentationSlotService;
import org.ftclub.cabinet.presentation.dto.DataListResponseDto;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v6/admin/presentations")
@RequiredArgsConstructor
public class AdminPresentationSlotController {

	private final AdminPresentationSlotService adminPresentationSlotService;

	/**
	 * 프레젠테이션 슬롯을 등록합니다.
	 *
	 * @param slotRequestDto 프레젠테이션 슬롯 등록 요청 DTO
	 */
	@PostMapping("/slots")
	public void registerPresentationSlot(
			@RequestBody @Valid AdminPresentationSlotRequestDto slotRequestDto) {
		adminPresentationSlotService.registerPresentationSlot(
				new PresentationSlotRegisterServiceDto(
						slotRequestDto.getStartTime(),
						slotRequestDto.getPresentationLocation()
				));
	}

	/**
	 * 프레젠테이션 슬롯을 업데이트합니다.
	 *
	 * @param slotRequestDto 프레젠테이션 슬롯 업데이트 요청 DTO
	 * @param slotId         프레젠테이션 슬롯 ID
	 */
	@PatchMapping("/slots/{slotId}")
	public void updatePresentationSlot(
			@RequestBody @Valid AdminPresentationSlotRequestDto slotRequestDto,
			@PathVariable("slotId") Long slotId) {
		adminPresentationSlotService.updatePresentationSlot(
				new PresentationSlotUpdateServiceDto(
						slotId,
						slotRequestDto.getStartTime(),
						slotRequestDto.getPresentationLocation()
				));
	}

	/**
	 * 프레젠테이션 슬롯을 삭제합니다.
	 *
	 * @param slotId 프레젠테이션 슬롯 ID
	 */
	@DeleteMapping("/slots/{slotId}")
	public void deletePresentationSlot(@PathVariable Long slotId) {
		adminPresentationSlotService.deletePresentationSlot(slotId);
	}

	/**
	 * 프레젠테이션 슬롯을 조회합니다.
	 *
	 * @param yearMonth 년월 (yyyy-MM 형식)
	 * @param status    상태
	 * @return 프레젠테이션 슬롯 리스트
	 */
	@GetMapping("/slots")
	public DataListResponseDto<PresentationSlotResponseDto> getSlots(
			@RequestParam(value = "yearMonth")
			@DateTimeFormat(pattern = "yyyy-MM")
			YearMonth yearMonth,
			@RequestParam String status) {
		List<PresentationSlotResponseDto> slots = adminPresentationSlotService.getAvailableSlots(
				new PresentationSlotSearchServiceDto(
						yearMonth.getYear(),
						yearMonth.getMonth().getValue(),
						status
				));
		return new DataListResponseDto<>(slots);
	}
}
