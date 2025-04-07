package org.ftclub.cabinet.presentation.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.PresentationCommentRequestDto;
import org.ftclub.cabinet.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.dto.PresentationCommentServiceCreationDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.presentation.service.PresentationCommentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v6/presentations")
@RequiredArgsConstructor
public class PresentationCommentController {

	private final PresentationCommentService presentationCommentService;

	@PostMapping("/{presentationId}/comments")
	public PresentationCommentResponseDto createPresentationComment(
			@AuthenticationPrincipal UserInfoDto user,
			Long presentationId,
			@RequestBody @Valid PresentationCommentRequestDto requestDto
	) {
		//
		return presentationCommentService.createPresentationComment(
			new PresentationCommentServiceCreationDto(
				user.getUserId(),
				presentationId,
				requestDto.getCommentDetail()
			)
		);
	}
}
