package org.ftclub.cabinet.presentation.service;

import java.io.IOException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.mapper.PresentationMapper;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.dto.PresentationDetailDto;
import org.ftclub.cabinet.presentation.dto.PresentationFormRequestDto;
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
			PresentationFormRequestDto form,
			MultipartFile thumbnail) throws IOException {
		User user = userQueryService.getUser(userId);
		String thumbnailS3Key = thumbnailStorageService.uploadImage(thumbnail);

		// TODO: slot 검증로직으로 대체
		PresentationSlot slot = slotRepository.findById(form.getSlotId())
				.orElseThrow(ExceptionStatus.SLOT_NOT_FOUND::asServiceException);

		// register presentation and assign presentation to slot
		Presentation newPresentation =
				commandService.createPresentation(user, form, slot, thumbnailS3Key);
		slot.assignPresentation(newPresentation);
	}

	/**
	 * 프레젠테이션 상세 정보를 조회합니다.
	 *
	 * @param userInfo       사용자 정보
	 * @param presentationId 프레젠테이션 ID
	 */
	@Transactional(readOnly = true)
	public PresentationDetailDto getPresentationDetail(UserInfoDto userInfo,
			Long presentationId) {
		Presentation presentation = queryService.getPresentationById(presentationId);

		// check verification of access to presentation detail
		policyService.verifyPresentationDetailAccess(userInfo, presentation);

		Long likesCount = 0L;
//		likesCount = likeQueryService.getLikesCount(presentationId);    // TODO: likeQueryService
		Boolean isLikedByMe = false;
		Boolean isMine = false;
		if (userInfo != null && !userInfo.hasRole("ADMIN")) {
			Long userId = userInfo.getUserId();
			Long presentationUserId = presentation.getUser().getId();
//			isLiked = likeQueryService.isLikedByUser(userId, presentationId);   // TODO: likeQueryService
			isMine = userId.equals(presentationUserId);
		}
		Boolean isUpcoming = presentation.getStartTime().isAfter(LocalDateTime.now());

		return presentationMapper.toPresentationDetailDto(
				presentation,
				likesCount,
				isLikedByMe,
				isMine,
				isUpcoming
		);
	}
}
