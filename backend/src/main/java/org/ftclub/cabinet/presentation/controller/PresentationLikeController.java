package org.ftclub.cabinet.presentation.controller;

import org.ftclub.cabinet.dto.PresentationLikeDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.ftclub.cabinet.presentation.service.PresentationLikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/v6/presentations")
public class PresentationLikeController {

	private PresentationLikeService presentationLikeService;
	PresentationLikeDto dto;

	@PostMapping("/{presentationId}/likes")
	public void postLike(
			@PathVariable Long presentationId,
			@AuthenticationPrincipal UserInfoDto userInfoDto,
			@CookieValue("jwt") String jwtToken) {
		Long userId = userInfoDto.getUserId();
		LocalDateTime now = LocalDateTime.now();
		presentationLikeService.postLike(new PresentationLikeDto(presentationId, userId, now));
	}
}
