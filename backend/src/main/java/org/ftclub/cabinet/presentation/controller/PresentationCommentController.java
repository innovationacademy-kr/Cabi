package org.ftclub.cabinet.presentation.controller;

import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.presentation.dto.DataResponseDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentRequestDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentServiceCreationDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentServiceDeleteDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentServiceUpdateDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentsResponseDto;
import org.ftclub.cabinet.presentation.service.PresentationCommentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Logging
@RestController
@RequestMapping("/v6/presentations/{presentationId}/comments")
@RequiredArgsConstructor
public class PresentationCommentController {

	private final PresentationCommentService presentationCommentService;

	@GetMapping
	public PresentationCommentsResponseDto getPresentationComments(
			@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long presentationId
	) {
		List<PresentationCommentResponseDto> commentList =
				presentationCommentService.getCommentsByPresentationId(
						(user != null) ? user.getUserId() : null,
						presentationId
				);

		return new PresentationCommentsResponseDto(commentList);
	}

	@PostMapping
	public PresentationCommentResponseDto createPresentationComment(
			@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long presentationId,
			@RequestBody @Valid PresentationCommentRequestDto requestDto
	) {
		//
		return presentationCommentService.createPresentationComment(
				new PresentationCommentServiceCreationDto(
						user.getUserId(),
						presentationId,
						requestDto.getDetail()
				)
		);
	}

	@PatchMapping("/{commentId}")
	public DataResponseDto<PresentationCommentResponseDto> updatePresentationComment(
			@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long presentationId,
			@PathVariable Long commentId,
			@RequestBody @Valid PresentationCommentRequestDto requestDto
	) {
		PresentationCommentResponseDto response = presentationCommentService.updatePresentationComment(
				new PresentationCommentServiceUpdateDto(
						user.getUserId(),
						presentationId,
						commentId,
						requestDto.getDetail()
				)
		);

		return new DataResponseDto<>(response);
	}

	@DeleteMapping("/{commentId}")
	public void deletePresentationComment(
			@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long presentationId,
			@PathVariable Long commentId
	) {
		presentationCommentService.deletePresentationComment(
				new PresentationCommentServiceDeleteDto(
						user.getUserId(),
						presentationId,
						commentId
				)
		);
	}
}
