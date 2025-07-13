package org.ftclub.cabinet.presentation.service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.mapper.PresentationMapper;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.domain.PresentationUpdateData;
import org.ftclub.cabinet.presentation.dto.PresentationDetailDto;
import org.ftclub.cabinet.presentation.dto.PresentationMyListDto;
import org.ftclub.cabinet.presentation.dto.PresentationPageResponseDto;
import org.ftclub.cabinet.presentation.dto.PresentationRegisterServiceDto;
import org.ftclub.cabinet.presentation.dto.PresentationSummaryDto;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateServiceDto;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
	private final PresentationSlotService slotService;
	private final PresentationLikeService likeService;
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

		PresentationSlot slot = slotService.findPresentationSlotById(form.getSlotId());

		slotService.validateSlotAvailable(slot);

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
		Long likesCount = likeService.countLikes(presentationId);
		boolean likedByMe, editAllowed;
		if (userId != null) {
			likedByMe = likeService.isLikedByUser(presentationId, userId);
			editAllowed = userId.equals(presentation.getUser().getId());
		} else {
			likedByMe = false;
			editAllowed = false;
		}

		return presentationMapper.toPresentationDetailDto(
				presentation,
				thumbnailLink,
				likesCount,
				likedByMe,
				editAllowed
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
		// get user's presentations
		List<Presentation> presentations =
				queryService.findPresentationsByUserId(userId);

		return presentations.stream()
				.map(presentationMapper::toPresentationMyListDto)
				.collect(Collectors.toList());
	}


	/**
	 * 조건에 맞는 발표 목록을 조회합니다.
	 *
	 * @param userId   사용자 ID (비로그인 시 null)
	 * @param category 카테고리 필터
	 * @param sort     정렬 기준
	 * @param pageable 페이징 정보
	 * @return 페이징된 발표 목록 응답 DTO
	 */
	@Transactional(readOnly = true)
	public PresentationPageResponseDto getPresentations(Long userId, Category category,
			String sort, Pageable pageable) {
		// userId가 null이면 익명 유저이므로, 'public' 발표만 조회하도록 플래그 설정
		boolean publicOnly = (userId == null);

		Page<Presentation> presentationPage = queryService.findPresentationsWithConditions(
				category, sort, pageable, publicOnly
		);
		// 현재 로그인한 사용자 ID를 전달하여 추가 정보 채움
		return enrichAndMapPresentationPage(presentationPage, userId);
	}

	/**
	 * 내가 '좋아요' 누른 발표 목록을 조회합니다.
	 *
	 * @param userId   사용자 ID
	 * @param pageable 페이징 정보
	 * @return 페이징된 발표 목록 응답 DTO
	 */
	@Transactional(readOnly = true)
	public PresentationPageResponseDto getMyLikedPresentations(Long userId, Pageable pageable) {
		// 사용자가 좋아요를 누른 PresentationLike를 페이징하여 조회
		Page<PresentationLike> likedPage = likeService.findPresentationLikes(userId,
				pageable);
		// PresentationLike 페이지를 Presentation 페이지로 변환
		Page<Presentation> presentationPage = likedPage.map(PresentationLike::getPresentation);
		// 현재 로그인한 사용자 ID를 전달하여 추가 정보 채움
		return enrichAndMapPresentationPage(presentationPage, userId);
	}


	/**
	 * [공통 헬퍼 메서드] Presentation 페이지에 추가 정보를 채워 최종 응답 DTO로 변환합니다.
	 *
	 * @param presentationPage 원본 Presentation 페이징 데이터
	 * @param userId           현재 로그인한 사용자 ID (비로그인 시 null)
	 * @return 페이징된 최종 응답 DTO
	 */
	private PresentationPageResponseDto enrichAndMapPresentationPage(
			Page<Presentation> presentationPage, Long userId) {
		List<Presentation> presentations = presentationPage.getContent();

		if (presentations.isEmpty()) {
			return new PresentationPageResponseDto(Collections.emptyList(),
					presentationPage.getNumber(), presentationPage.getTotalPages(),
					presentationPage.getTotalElements(), presentationPage.isLast());
		}

		// 1. '좋아요' 개수 한 번에 조회
		List<Long> presentationIds = presentations.stream().map(Presentation::getId)
				.collect(Collectors.toList());
		Map<Long, Long> likeCountsMap = likeService.findLikeCountsMap(presentationIds);

		// 2. 현재 유저가 '좋아요' 누른 발표 ID 목록 한 번에 조회 (로그인 시)
		Set<Long> likedByMeIds = (userId != null)
				? likeService.findLikedPresentationIds(userId, presentationIds)
				: Collections.emptySet();

		// 3. 최종 DTO로 매핑
		List<PresentationSummaryDto> content = presentations.stream().map(p -> {
			String thumbnailLink = thumbnailStorageService.generatePresignedUrl(
					p.getThumbnailS3Key());
			long likeCount = likeCountsMap.getOrDefault(p.getId(), 0L);
			boolean likedByMe = likedByMeIds.contains(p.getId());
			return PresentationSummaryDto.builder()
					.presentationId(p.getId())
					.startTime(p.getStartTime())
					.presentationLocation(p.getPresentationLocation())
					.title(p.getTitle())
					.summary(p.getSummary())
					.category(p.getCategory())
					.userName(p.getUser().getName())
					.thumbnailLink(thumbnailLink)
					.likeCount(likeCount)
					.likedByMe(likedByMe)
					.presentationStatus(p.getCurrentStatus())
					.build();
		}).collect(Collectors.toList());

		// 4. 페이징 정보와 함께 반환
		return PresentationPageResponseDto.builder()
				.content(content)
				.currentPage(presentationPage.getNumber())
				.totalPage(presentationPage.getTotalPages())
				.totalElements(presentationPage.getTotalElements())
				.last(presentationPage.isLast())
				.build();
	}
}
