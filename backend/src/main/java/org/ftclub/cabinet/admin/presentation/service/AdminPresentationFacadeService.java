package org.ftclub.cabinet.admin.presentation.service;

import java.io.IOException;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminPresentationCalendarItemDto;
import org.ftclub.cabinet.mapper.PresentationMapper;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationUpdateData;
import org.ftclub.cabinet.presentation.dto.PresentationDetailDto;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateServiceDto;
import org.ftclub.cabinet.presentation.service.PresentationCommandService;
import org.ftclub.cabinet.presentation.service.PresentationLikeService;
import org.ftclub.cabinet.presentation.service.PresentationPolicyService;
import org.ftclub.cabinet.presentation.service.PresentationQueryService;
import org.ftclub.cabinet.presentation.service.ThumbnailStorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AdminPresentationFacadeService {

	private final PresentationQueryService queryService;
	private final PresentationCommandService commandService;
	private final PresentationPolicyService policyService;
	private final ThumbnailStorageService thumbnailStorageService;
	private final PresentationLikeService likeService;
	private final PresentationMapper presentationMapper;

	/**
	 * 일정 관리(달력)에서 해당 연월의 프레젠테이션 목록을 조회합니다.
	 *
	 * @param yearMonth yyyy-MM 형식의 연월
	 * @return 프레젠테이션 목록
	 */
	@Transactional(readOnly = true)
	public List<AdminPresentationCalendarItemDto> getPresentationsByYearMonth(YearMonth yearMonth) {
		// 연월에 해당하는 모든 프레젠테이션 목록을 조회(취소 포함)
		List<Presentation> presentations = queryService.findPresentationsByYearMonth(
				yearMonth);

		return presentations.stream()
				.map(presentationMapper::toAdminPresentationCalendarItemDto)
				.collect(Collectors.toList());
	}

	/**
	 * 프레젠테이션 상세 정보를 조회합니다.
	 *
	 * @param presentationId 프레젠테이션 ID
	 */
	@Transactional(readOnly = true)
	public PresentationDetailDto getPresentationDetail(Long presentationId) {
		Presentation presentation = queryService.findPresentationByIdWithUser(presentationId);
		String thumbnailLink = thumbnailStorageService.generatePresignedUrl(
				presentation.getThumbnailS3Key());
		Long likesCount = likeService.countLikes(presentationId);
		boolean editAllowed = presentation.isCanceled() ? false : true;

		return presentationMapper.toPresentationDetailDto(
				presentation,
				thumbnailLink,
				likesCount,
				false,
				editAllowed
		);
	}

	/**
	 * 프레젠테이션을 수정합니다. (User보다 더 넓은 범위의 내용 수정)
	 *
	 * @param presentationId 프레젠테이션 ID
	 * @param updateForm     프레젠테이션 수정 DTO
	 * @param thumbnail      썸네일 이미지 파일
	 */
	@Transactional
	public void updatePresentation(Long presentationId,
			PresentationUpdateServiceDto updateForm,
			MultipartFile thumbnail, boolean thumbnailUpdated) throws IOException {
		Presentation presentation = queryService.findPresentationById(presentationId);
		// check verification of access to edit presentation
		policyService.verifyAdminPresentationEditAccess(presentation);

		// update contents
		String thumbnailS3Key;
		if (thumbnailUpdated) {
			thumbnailS3Key = thumbnailStorageService.updateThumbnail(
					presentation.getThumbnailS3Key(), thumbnail);
		} else {
			thumbnailS3Key = presentation.getThumbnailS3Key();
		}
		PresentationUpdateData updateData =
				presentationMapper.toPresentationUpdateData(updateForm, thumbnailS3Key);
		commandService.updatePresentation(presentation, updateData);
	}

	/**
	 * 프레젠테이션을 취소합니다.
	 *
	 * @param presentationId 프레젠테이션 ID
	 */
	@Transactional
	public void cancelPresentation(Long presentationId) {
		commandService.cancelPresentation(presentationId);
	}
}
