package org.ftclub.cabinet.presentation.service;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.dto.PresentationCommentServiceCreationDto;
import org.ftclub.cabinet.dto.PresentationCommentServiceUpdateDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.PresentationComment;
import org.ftclub.cabinet.presentation.repository.PresentationCommentRepository;
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

		PresentationComment savedComment = commentRepository.save(new PresentationComment(
				presentationQueryService.getPresentation(dto.getPresentationId()),
				userQueryService.getUser(dto.getUserId()),
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
		if (commentDetail.length() > 500) {
			throw ExceptionStatus.PRESENTATION_COMMENT_TOO_LONG.asServiceException();
		}
		if (commentDetail.isBlank()) {
			throw ExceptionStatus.PRESENTATION_COMMENT_EMPTY.asServiceException();
		}
	}

	public List<PresentationCommentResponseDto> getCommentsByPresentationId(
			Long userId,
			Long presentationId
	) {
		List<PresentationComment> comments = commentRepository.findByPresentationIdOrderByCreatedAtAsc(presentationId);
		return comments.stream()
				.map(comment -> new PresentationCommentResponseDto(
						comment.getId(),
						comment.getUser().getName(),
						comment.getDetail(),
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

		if (comment.getUser().getId() != dto.getUserId()) {
			throw ExceptionStatus.PRESENTATION_COMMENT_NOT_AUTHORIZED.asServiceException();
		}

		comment.updateDetail(dto.getCommentDetail());
		commentRepository.save(comment);
		return new PresentationCommentResponseDto(
				comment.getId(),
				comment.getUser().getName(),
				comment.getDetail(),
				comment.getUpdatedAt(),
				true, comment.isBanned(), true
		);
	}
}
