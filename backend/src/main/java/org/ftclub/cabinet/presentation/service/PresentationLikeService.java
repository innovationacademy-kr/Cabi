package org.ftclub.cabinet.presentation.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.ftclub.cabinet.presentation.dto.PresentationLikeServiceDto;
import org.ftclub.cabinet.presentation.repository.PresentationLikeRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PresentationLikeService {

	private final UserQueryService userQueryService;
	private final PresentationQueryService presentationQueryService;

	private final PresentationLikeRepository presentationLikeRepository;

	public void createLike(PresentationLikeServiceDto dto) {
		if (presentationLikeRepository.findByPresentationIdAndUserId(
				dto.getPresentationId(), dto.getUserId()
		).isPresent()) {
			// 이미 좋아요가 존재하는 경우, 예외 처리
			throw ExceptionStatus.PRESENTATION_LIKE_ALREADY_EXISTS.asServiceException();
		}

		// 좋아요가 존재하지 않는 경우, 새로 생성
		Presentation presentation = presentationQueryService.findPresentationById(
				dto.getPresentationId());
		if (presentation.isCanceled()) {
			// 발표가 취소된 경우, 예외 처리
			throw ExceptionStatus.PRESENTATION_ALREADY_CANCELED.asServiceException();
		}
		User user = userQueryService.getUser(dto.getUserId());

		// PresentationLike 객체 생성 및 저장
		// `CascadeType.ALL` 설정으로 인해 transaction commit 시점에 자동으로 저장됨
		PresentationLike newLike = new PresentationLike(presentation, user);
		presentation.addLike(newLike);

	}

	public void deleteLike(PresentationLikeServiceDto dto) {
		// 좋아요가 존재하지 않는 경우, 예외 처리
		PresentationLike like = presentationLikeRepository.findByPresentationIdAndUserId(
				dto.getPresentationId(), dto.getUserId()
		).orElseThrow(ExceptionStatus.PRESENTATION_LIKE_NOT_FOUND::asServiceException);

		// 좋아요가 존재하는 경우, 삭제
		// `orphanRemoval = true` 설정으로 인해, PresentationLike 엔티티가
		// transaction commit 시점에 자동으로 삭제됨
		Presentation presentation = like.getPresentation();
		if (presentation.isCanceled()) {
			// 발표가 취소된 경우, 예외 처리
			throw ExceptionStatus.PRESENTATION_ALREADY_CANCELED.asServiceException();
		}
		presentation.removeLike(like);
	}

	public Long countLikes(Long presentationId) {
		// 프레젠테이션 ID로 좋아요 수를 카운트
		return presentationLikeRepository.countByPresentationId(presentationId);
	}

	public boolean isLikedByUser(Long presentationId, Long userId) {
		// 프레젠테이션 ID와 사용자 ID로 좋아요 여부 확인
		return presentationLikeRepository.existsByPresentationIdAndUserId(presentationId, userId);
	}

	public Page<PresentationLike> findPresentationLikes(Long userId, Pageable pageable) {
		// 사용자 ID로 좋아요한 프레젠테이션을 최신순으로 페이징하여 조회
		return presentationLikeRepository.findByUserIdAndPresentationCanceledFalseOrderByPresentationStartTimeDesc(
				userId,
				pageable);
	}

	public Map<Long, Long> findLikeCountsMap(List<Long> presentationIds) {
		return presentationLikeRepository.findLikeCountsByPresentationIds(
						presentationIds).stream()
				.collect(Collectors.toMap(k -> (Long) k[0], v -> (Long) v[1]));
	}

	public Set<Long> findLikedPresentationIds(Long userId, List<Long> presentationIds) {
		// 사용자 ID와 발표 ID 목록으로 좋아요한 발표 ID 집합 조회
		return presentationLikeRepository.findLikedPresentationIdsByUserId(userId,
				presentationIds);
	}
}
