package org.ftclub.cabinet.presentation.controller;


import java.io.IOException;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.presentation.dto.DataListResponseDto;
import org.ftclub.cabinet.presentation.dto.DataResponseDto;
import org.ftclub.cabinet.presentation.dto.PresentationDetailDto;
import org.ftclub.cabinet.presentation.dto.PresentationMyListDto;
import org.ftclub.cabinet.presentation.dto.PresentationRegisterRequestDto;
import org.ftclub.cabinet.presentation.dto.PresentationRegisterServiceDto;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateRequestDto;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateServiceDto;
import org.ftclub.cabinet.presentation.service.PresentationFacadeService;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@Slf4j
@RestController
@RequestMapping("/v6/presentations")
@RequiredArgsConstructor
public class PresentationController {

	private final PresentationFacadeService presentationFacadeService;

	/**
	 * 프레젠테이션을 등록합니다.
	 *
	 * @param user      사용자 정보 (USER)
	 * @param form      프레젠테이션 등록 요청 DTO
	 * @param thumbnail 썸네일 이미지 파일 (선택)
	 * @throws IOException 썸네일 이미지 업로드 중 발생할 수 있는 IOException
	 */
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public void registerPresentation(
			@AuthenticationPrincipal UserInfoDto user,
			@Valid @RequestPart("form") PresentationRegisterRequestDto form,
			@RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail
	) throws IOException {
		presentationFacadeService.registerPresentation(
				user.getUserId(),
				PresentationRegisterServiceDto.builder()
						.duration(form.getDuration())
						.category(form.getCategory())
						.title(form.getTitle())
						.summary(form.getSummary())
						.outline(form.getOutline())
						.detail(form.getDetail())
						.recordingAllowed(form.isRecordingAllowed())
						.publicAllowed(form.isPublicAllowed())
						.slotId(form.getSlotId())
						.build(),
				thumbnail
		);
	}

	/**
	 * 프레젠테이션 상세 정보를 조회합니다.
	 *
	 * @param user           사용자 정보 (USER, ANONYMOUS=null)
	 * @param presentationId 프레젠테이션 ID
	 * @return 프레젠테이션 상세 정보
	 */
	@GetMapping("/{presentationId}")
	public DataResponseDto<PresentationDetailDto> getPresentationDetail(
			@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long presentationId) {
		Long userId = user != null ? user.getUserId() : null;
		PresentationDetailDto detail = presentationFacadeService.getPresentationDetail(
				userId, presentationId);
		return new DataResponseDto<>(detail);
	}

	/**
	 * 프레젠테이션을 수정합니다.
	 *
	 * @param user           사용자 정보 (USER)
	 * @param presentationId 프레젠테이션 ID
	 * @param updateForm     프레젠테이션 수정 요청 DTO
	 * @param thumbnail      썸네일 이미지 파일 (변경 시)
	 * @throws IOException 썸네일 이미지 업로드 중 발생할 수 있는 IOException
	 */
	@PatchMapping("/{presentationId}")
	public void updatePresentation(
			@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long presentationId,
			@Valid @RequestPart("form") PresentationUpdateRequestDto updateForm,
			@RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail
	) throws IOException {
		presentationFacadeService.updatePresentation(
				user.getUserId(),
				presentationId,
				PresentationUpdateServiceDto.builder()
						.category(updateForm.getCategory())
						.duration(updateForm.getDuration())
						.title(updateForm.getTitle())
						.summary(updateForm.getSummary())
						.outline(updateForm.getOutline())
						.detail(updateForm.getDetail())
						.videoLink(updateForm.getVideoLink())
						.recordingAllowed(updateForm.isRecordingAllowed())
						.publicAllowed(updateForm.isPublicAllowed())
						.build(),
				thumbnail,
				updateForm.isThumbnailUpdated()
		);
	}

	/**
	 * 나의 프레젠테이션 기록을 조회합니다.
	 *
	 * @param user 사용자 정보 (USER)
	 * @return 프레젠테이션 기록 목록
	 */
	@GetMapping("/me/histories")
	public DataListResponseDto<PresentationMyListDto> getMyPresentations(
			@AuthenticationPrincipal UserInfoDto user) {
		List<PresentationMyListDto> myPresentations =
				presentationFacadeService.getMyPresentations(user.getUserId());
		return new DataListResponseDto<>(myPresentations);
	}
}
