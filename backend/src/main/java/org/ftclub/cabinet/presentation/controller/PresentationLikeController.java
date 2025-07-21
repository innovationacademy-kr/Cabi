package org.ftclub.cabinet.presentation.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.presentation.dto.PresentationLikeServiceDto;
import org.ftclub.cabinet.presentation.service.PresentationLikeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v6/presentations")
@RequiredArgsConstructor
public class PresentationLikeController {

	private final PresentationLikeService presentationLikeService;

	@PostMapping("/{presentationId}/likes")
	public void createPresentationLike(
			@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long presentationId
	) {
		presentationLikeService.createLike(
				PresentationLikeServiceDto.builder()
						.userId(user.getUserId())
						.presentationId(presentationId)
						.build()
		);
	}

	@DeleteMapping("/{presentationId}/likes")
	public void deletePresentationLike(
			@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long presentationId
	) {
		presentationLikeService.deleteLike(
				PresentationLikeServiceDto.builder()
						.userId(user.getUserId())
						.presentationId(presentationId)
						.build()
		);
	}
}
