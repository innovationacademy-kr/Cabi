package org.ftclub.cabinet.presentation.controller;

import org.ftclub.cabinet.presentation.dto.PresentationLikeDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.presentation.service.PresentationLikeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/v6/presentations/{presentationId}")
public class PresentationLikeController {

	private final PresentationLikeService presentationLikeService;

	public PresentationLikeController(PresentationLikeService presentationLikeService) {
		this.presentationLikeService = presentationLikeService;
	}

	@PostMapping("/likes")
	public void postLike(
			@PathVariable Long presentationId,
			@AuthenticationPrincipal UserInfoDto userInfoDto) { //이거 jwt파싱용으로 이걸 쓰면 userInfoDto에 user 정보 들어감(시큐리티 뭐시기 설정해둬서)
		Long userId = userInfoDto.getUserId();
		LocalDateTime now = LocalDateTime.now();
		presentationLikeService.postLike(new PresentationLikeDto(presentationId, userId, now));
	}

	@DeleteMapping("/likes")
	public void deleteLike(
			@PathVariable Long presentationId,
			@AuthenticationPrincipal UserInfoDto userInfoDto) {
		Long userId = userInfoDto.getUserId();
		LocalDateTime now = LocalDateTime.now();
		presentationLikeService.deleteLike(new PresentationLikeDto(presentationId, userId, now));
	}

//	@GetMapping("/me/likes")
//	public void getPostsLikedByUser(
//			@PathVariable Long presentationId,
//			@AuthenticationPrincipal UserInfoDto userInfoDto) {
//		Long userId = userInfoDto.getUserId();
//		LocalDateTime now = LocalDateTime.now();
//		presentationLikeService.getPostsLikedByUser(new PresentationLikeDto(presentationId, userId, now));
//	}
}
