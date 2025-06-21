package org.ftclub.cabinet.presentation.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.mapper.PresentationMapper;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.dto.PresentationDetailDto;
import org.ftclub.cabinet.presentation.dto.PresentationMyListDto;
import org.ftclub.cabinet.presentation.dto.PresentationRegisterServiceDto;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateData;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateServiceDto;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class PresentationFacadeService {

	private final PresentationCommandService commandService;
	private final PresentationQueryService queryService;
	private final PresentationPolicyService policyService;
	private final UserQueryService userQueryService;
	private final ThumbnailStorageService thumbnailStorageService;
	private final PresentationSlotRepository slotRepository;        // TODO
	//	private final PresentationSlotFacadeService slotFacadeService;  // TODO
//	private final PresentationLikeQueryService likeQueryService;    // TODO
	private final PresentationMapper presentationMapper;

	/**
	 * 프레젠테이션을 등록합니다.
	 *
	 * @param userId    사용자 ID
	 * @param form      프레젠테이션 등록 요청 DTO
	 * @param thumbnail 썸네일 이미지 파일
	 */
	@Transactional
	public void registerPresentation(Long userId,
			PresentationRegisterServiceDto form,
			MultipartFile thumbnail) throws IOException {
		User user = userQueryService.getUser(userId);
		String thumbnailS3Key = thumbnailStorageService.uploadImage(thumbnail);

		// TODO: slot 검증로직으로 대체
		PresentationSlot slot = slotRepository.findById(form.getSlotId())
				.orElseThrow(ExceptionStatus.SLOT_NOT_FOUND::asServiceException);

		// register presentation
		commandService.createPresentation(user, form, slot, thumbnailS3Key);
	}

	/**
	 * 프레젠테이션 상세 정보를 조회합니다.
	 *
	 * @param userId         사용자 ID (ANONYMOUS=null)
	 * @param presentationId 프레젠테이션 ID
	 */
	@Transactional(readOnly = true)
	public PresentationDetailDto getPresentationDetail(Long userId,
			Long presentationId) {
		Presentation presentation = queryService.findPresentationByIdWithUser(presentationId);

		// check verification of access to presentation detail
		policyService.verifyPresentationDetailAccess(userId, presentation);

		String thumbnailLink = thumbnailStorageService.generatePresignedUrl(
				presentation.getThumbnailS3Key());
		Long likesCount = 0L;   // likeQueryService.getLikesCount(presentationId);    // TODO: likeQueryService
		boolean likedByMe = false;
		boolean editAllowed = false;
		if (userId != null) {
//			likedByMe = likeQueryService.isLikedByUser(userId, presentationId);   // TODO: likeQueryService
			editAllowed = userId.equals(presentation.getUser().getId());
		}
		boolean upcoming = presentation.getStartTime().isAfter(LocalDateTime.now());

		return presentationMapper.toPresentationDetailDto(
				presentation,
				thumbnailLink,
				likesCount,
				likedByMe,
				editAllowed,
				upcoming
		);
	}

	/**
	 * 프레젠테이션을 수정합니다.
	 *
	 * @param userId           사용자 ID
	 * @param presentationId   프레젠테이션 ID
	 * @param updateForm       프레젠테이션 수정 DTO
	 * @param thumbnail        썸네일 이미지 파일
	 * @param thumbnailUpdated 썸네일 이미지가 변경되었는지 여부
	 */
	@Transactional
	public void updatePresentation(Long userId, Long presentationId,
			PresentationUpdateServiceDto updateForm,
			MultipartFile thumbnail, boolean thumbnailUpdated) throws IOException {
		Presentation presentation = queryService.findPresentationById(presentationId);
		// check verification of access to edit presentation & user update fields
		policyService.verifyPresentationEditAccess(userId, presentation);
		policyService.checkForIllegalFieldModification(updateForm, presentation);

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
	 * 나의 프레젠테이션 기록을 조회합니다.
	 *
	 * @param userId 사용자 ID (ANONYMOUS=null)
	 * @return 프레젠테이션 기록 목록
	 */
	@Transactional(readOnly = true)
	public List<PresentationMyListDto> getMyPresentations(Long userId) {
		// check verification
		policyService.verifyMyPresentationsAccess(userId);

		// get user's presentations
		List<Presentation> presentations =
				queryService.findPresentationsByUserId(userId);
		
		return presentations.stream()
				.map(presentationMapper::toPresentationMyListDto)
				.collect(Collectors.toList());
	}
}
