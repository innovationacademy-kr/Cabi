package org.ftclub.cabinet.presentation.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.dto.PresentationCommentServiceCreationDto;
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
}
