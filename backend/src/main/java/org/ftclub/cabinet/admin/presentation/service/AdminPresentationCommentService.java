package org.ftclub.cabinet.admin.presentation.service;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.PresentationComment;
import org.ftclub.cabinet.presentation.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.presentation.repository.PresentationCommentRepository;
import org.ftclub.cabinet.presentation.service.PresentationQueryService;
import org.ftclub.cabinet.admin.dto.AdminPresentationCommentBanResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional
public class AdminPresentationCommentService {

	private final PresentationQueryService presentationQueryService;
	private final PresentationCommentRepository commentRepository;

	@Transactional(readOnly = true)
	public List<PresentationCommentResponseDto> getComments(Long presentationId) {
		presentationQueryService.findPresentationByIdWithUser(presentationId);

		List<PresentationComment> comments =
				commentRepository.findByPresentationIdAndDeletedFalseOrderByCreatedAtAsc(
						presentationId);

		return comments.stream()
				.map(comment -> new PresentationCommentResponseDto(
						comment.getId(),
						comment.getUser().getName(),
						comment.getDetail(),
						comment.getCreatedAt(),
						false, // mine
						comment.isBanned(),
						comment.getUpdatedAt().isAfter(comment.getCreatedAt())
				)).collect(Collectors.toList());
	}

	public AdminPresentationCommentBanResponseDto banOrUnbanComment(Long presentationId,
			Long commentId,
			boolean isBanned) {
		PresentationComment comment = findCommentAndVerifyAssociation(presentationId, commentId);

		if (comment.isBanned() != isBanned) {
			if (isBanned) {
				comment.ban();
			} else {
				comment.unban();
			}
		}
		return new AdminPresentationCommentBanResponseDto(comment.getDetail(), comment.isBanned());
	}

	public void deleteComment(Long presentationId, Long commentId) {
		PresentationComment comment = findCommentAndVerifyAssociation(presentationId, commentId);

		comment.delete();
	}

	private PresentationComment findCommentAndVerifyAssociation(Long presentationId,
			Long commentId) {
		// 발표 자료 존재 확인
		presentationQueryService.findPresentationByIdWithUser(presentationId);

		// 댓글 존재 확인
		PresentationComment comment = commentRepository.findById(commentId)
				.orElseThrow(ExceptionStatus.PRESENTATION_COMMENT_NOT_FOUND::asServiceException);

		// 발표와 댓글의 연관 관계 확인
		if (!comment.getPresentation().getId().equals(presentationId)) {
			throw ExceptionStatus.PRESENTATION_COMMENT_INVALID_ASSOCIATION.asServiceException();
		}
		return comment;
	}
}
