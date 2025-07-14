package org.ftclub.cabinet.admin.presentation.controller;

import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminPresentationCommentBanRequestDto;
import org.ftclub.cabinet.admin.dto.AdminPresentationCommentBanResponseDto;
import org.ftclub.cabinet.admin.presentation.service.AdminPresentationCommentService;
import org.ftclub.cabinet.presentation.dto.DataResponseDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentsResponseDto;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v6/admin/presentations/{presentationId}/comments")
@RequiredArgsConstructor
public class AdminPresentationCommentController {

	private final AdminPresentationCommentService adminPresentationCommentService;

	/**
	 * 특정 발표에 달린 모든 댓글 목록을 조회합니다. (어드민용)
	 *
	 * @param presentationId 발표 ID
	 * @return 댓글 목록
	 */
	@GetMapping
	public PresentationCommentsResponseDto getPresentationComments(
			@PathVariable Long presentationId
	) {
		List<PresentationCommentResponseDto> comments =
				adminPresentationCommentService.getComments(presentationId);
		return new PresentationCommentsResponseDto(comments);
	}

	/**
	 * 특정 댓글을 밴 하거나 밴을 해제합니다. (어드민용)
	 *
	 * @param presentationId 발표 ID
	 * @param commentId      댓글 ID
	 * @param requestDto     밴 요청 정보
	 * @return 처리 결과
	 */
	@PatchMapping("/{commentId}")
	public DataResponseDto<AdminPresentationCommentBanResponseDto> banOrUnbanPresentationComment(
			@PathVariable Long presentationId,
			@PathVariable Long commentId,
			@RequestBody @Valid AdminPresentationCommentBanRequestDto requestDto
	) {
		AdminPresentationCommentBanResponseDto response =
				adminPresentationCommentService.banOrUnbanComment(
						presentationId, commentId, requestDto.isBanned());
		return new DataResponseDto<>(response);
	}

	/**
	 * 특정 댓글을 삭제합니다. (어드민용)
	 *
	 * @param presentationId 발표 ID
	 * @param commentId      댓글 ID
	 */
	@DeleteMapping("/{commentId}")
	public void deletePresentationComment(
			@PathVariable Long presentationId,
			@PathVariable Long commentId
	) {
		adminPresentationCommentService.deleteComment(presentationId, commentId);
	}
}
