package org.ftclub.cabinet.presentation.service;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.presentation.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentServiceCreationDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentServiceDeleteDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentServiceUpdateDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationComment;
import org.ftclub.cabinet.presentation.repository.PresentationCommentRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PresentationCommentService {

	private final UserQueryService userQueryService;
	private final PresentationQueryService presentationQueryService;

	private final PresentationCommentRepository commentRepository;

	public PresentationCommentResponseDto createPresentationComment(
			PresentationCommentServiceCreationDto dto
	) {
		verifyCommentSize(dto.getCommentDetail());

		Presentation presentation = presentationQueryService.findPresentationByIdWithUser(
				dto.getPresentationId());
		User user = userQueryService.getUser(dto.getUserId());

		PresentationComment savedComment = commentRepository.save(new PresentationComment(
				presentation,
				user,
				dto.getCommentDetail()
		));

		return new PresentationCommentResponseDto(
				savedComment.getId(),
				savedComment.getUser().getName(),
				savedComment.getDetail(),
				savedComment.getCreatedAt(),
				true, false, false
		);
	}

	private void verifyCommentSize(String commentDetail) {
		if (commentDetail == null || commentDetail.isBlank()) {
			throw ExceptionStatus.PRESENTATION_COMMENT_EMPTY.asServiceException();
		}
		if (commentDetail.length() > 500) {
			throw ExceptionStatus.PRESENTATION_COMMENT_TOO_LONG.asServiceException();
		}
	}

	public List<PresentationCommentResponseDto> getCommentsByPresentationId(
			Long userId,
			Long presentationId
	) {
		// Presentation 존재하는지 확인
		presentationQueryService.findPresentationByIdWithUser(presentationId);

		List<PresentationComment> comments = commentRepository.findByPresentationIdOrderByCreatedAtAsc(
				presentationId);

		return comments.stream()
				.map(comment -> new PresentationCommentResponseDto(
						comment.getId(),
						comment.getUser().getName(),
						(comment.isBanned()) ? "....." : comment.getDetail(),
						comment.getCreatedAt(),
						comment.getUser().getId().equals(userId),
						comment.isBanned(),
						comment.getUpdatedAt().isAfter(comment.getCreatedAt())
				)).collect(Collectors.toList());
	}

	public PresentationCommentResponseDto updatePresentationComment(
			PresentationCommentServiceUpdateDto dto
	) {
		PresentationComment comment = commentRepository.findById(dto.getCommentId())
				.orElseThrow(ExceptionStatus.PRESENTATION_COMMENT_NOT_FOUND::asServiceException);

		verifyPresentationAndCommentAssociation(comment, dto.getPresentationId());
		verifyCommentSize(dto.getCommentDetail());

		// 수정 권한 확인
		if (!comment.getUser().getId().equals(dto.getUserId()) || comment.isBanned()) {
			throw ExceptionStatus.PRESENTATION_COMMENT_NOT_AUTHORIZED.asServiceException();
		}

		comment.updateDetail(dto.getCommentDetail());

		return new PresentationCommentResponseDto(
				comment.getId(),
				comment.getUser().getName(),
				comment.getDetail(),
				comment.getUpdatedAt(),
				true, comment.isBanned(), true
		);
	}

	private void verifyPresentationAndCommentAssociation(PresentationComment comment,
			Long presentationId) {
		presentationQueryService.findPresentationByIdWithUser(presentationId);

		Presentation presentationOfComment = comment.getPresentation();
		if (!presentationOfComment.getId().equals(presentationId)) {
			throw ExceptionStatus.PRESENTATION_COMMENT_INVALID_ASSOCIATION.asServiceException();
		}
	}

	public void deletePresentationComment(
			PresentationCommentServiceDeleteDto dto
	) {
		PresentationComment comment = commentRepository.findById(dto.getCommentId())
				.orElseThrow(ExceptionStatus.PRESENTATION_COMMENT_NOT_FOUND::asServiceException);

		verifyPresentationAndCommentAssociation(comment, dto.getPresentationId());

		if (!comment.getUser().getId().equals(dto.getUserId())) {
			throw ExceptionStatus.PRESENTATION_COMMENT_NOT_AUTHORIZED.asServiceException();
		}
		if (comment.isBanned()) {
			throw ExceptionStatus.PRESENTATION_COMMENT_BANNED.asServiceException();
		}

		comment.delete();
	}
}
