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
	private final PresentationSlotRepository slotRepository; // TODO: service로 변경 필요
	//	private final PresentationSlotFacadeService slotFacadeService;  // TODO: 구현 후 연결 필요
//	private final PresentationLikeQueryService likeQueryService;    // TODO: 구현 후 연결 필요
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
		String thumbnailLink = thumbnailStorageService.uploadImage(thumbnail);

		// TODO: slot 검증 및 slotService에서 slotId 가져오는 것으로 변경 (현재의 orElseThrow 제거)
		PresentationSlot slot = slotRepository.findById(form.getSlotId())
				.orElseThrow(ExceptionStatus.SLOT_NOT_FOUND::asServiceException);

		Presentation newPresentation =
				commandService.createPresentation(user, form, slot, thumbnailLink);

		// TODO: 검증된 slot에 presentation id 등록
//		slotFacadeService.registerSlot(newPresentation);
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

		// TODO: likeQueryService 구현 후 연결 필요
		Long likesCount = 0L;
//		likesCount = likeQueryService.getLikesCount(presentationId);
		Boolean isLikedByMe = false;
		Boolean isMine = false;
		if (userInfo != null) {
			Long userId = userInfo.getUserId();
			Long presentationUserId = presentation.getUser().getId();
//			isLiked = likeQueryService.isLikedByUser(userId, presentationId);
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
