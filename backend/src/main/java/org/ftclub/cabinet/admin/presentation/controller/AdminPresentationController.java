package org.ftclub.cabinet.admin.presentation.controller;

import java.io.IOException;
import java.time.YearMonth;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminPresentationCalendarItemDto;
import org.ftclub.cabinet.admin.dto.AdminPresentationUpdateRequestDto;
import org.ftclub.cabinet.admin.dto.AdminPresentationUpdateServiceDto;
import org.ftclub.cabinet.admin.presentation.service.AdminPresentationFacadeService;
import org.ftclub.cabinet.presentation.dto.DataListResponseDto;
import org.ftclub.cabinet.presentation.dto.DataResponseDto;
import org.ftclub.cabinet.presentation.dto.PresentationDetailDto;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/v6/admin/presentations")
@RequiredArgsConstructor
public class AdminPresentationController {

	private final AdminPresentationFacadeService adminPresentationFacadeService;

	/**
	 * 어드민의 달력에 필요한 발표 데이터를 반환합니다.
	 *
	 * @param yearMonth yyyy-MM 형식의 연월
	 * @return 프레젠테이션 목록
	 */
	@GetMapping
	public DataListResponseDto<AdminPresentationCalendarItemDto> getPresentationsByYearMonth(
			@RequestParam(value = "yearMonth")
			@DateTimeFormat(pattern = "yyyy-MM")
			YearMonth yearMonth) {
		List<AdminPresentationCalendarItemDto> results =
				adminPresentationFacadeService.getPresentationsByYearMonth(yearMonth);

		return new DataListResponseDto<>(results);
	}

	/**
	 * 어드민에서 프레젠테이션 상세 정보를 조회합니다.
	 *
	 * @param presentationId 프레젠테이션 ID
	 * @return 프레젠테이션 상세 정보
	 */
	@GetMapping("/{presentationId}")
	public DataResponseDto<PresentationDetailDto> getPresentationDetail(
			@PathVariable Long presentationId) {
		PresentationDetailDto detail = adminPresentationFacadeService.getPresentationDetail(
				presentationId);
		return new DataResponseDto<>(detail);
	}

	/**
	 * 프레젠테이션을 수정합니다.
	 *
	 * @param presentationId 프레젠테이션 ID
	 * @param updateForm     프레젠테이션 수정 요청 DTO
	 * @param thumbnail      썸네일 이미지 파일 (변경 시)
	 * @throws IOException 썸네일 이미지 업로드 중 오류가 발생할 경우
	 */
	@PatchMapping("/{presentationId}")
	public void updatePresentation(
			@PathVariable Long presentationId,
			@Valid @RequestPart("form") AdminPresentationUpdateRequestDto updateForm,
			@RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail
	) throws IOException {
		adminPresentationFacadeService.updatePresentation(
				presentationId,
				AdminPresentationUpdateServiceDto.builder()
						.category(updateForm.getCategory())
						.duration(updateForm.getDuration())
						.title(updateForm.getTitle())
						.summary(updateForm.getSummary())
						.outline(updateForm.getOutline())
						.detail(updateForm.getDetail())
						.videoLink(updateForm.getVideoLink())
						.recordingAllowed(updateForm.isRecordingAllowed())
						.publicAllowed(updateForm.isPublicAllowed())
						.thumbnailUpdated(updateForm.isThumbnailUpdated())
						.build(),
				thumbnail
		);
	}

	/**
	 * 프레젠테이션을 취소합니다.
	 *
	 * @param presentationId 프레젠테이션 ID
	 */
	@DeleteMapping("/{presentationId}")
	public void cancelPresentation(
			@PathVariable Long presentationId) {
		adminPresentationFacadeService.cancelPresentation(presentationId);
	}
}
