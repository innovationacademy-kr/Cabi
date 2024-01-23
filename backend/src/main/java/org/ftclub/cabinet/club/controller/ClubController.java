package org.ftclub.cabinet.club.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.club.service.ClubFacadeService;
import org.ftclub.cabinet.dto.AddClubUserRequestDto;
import org.ftclub.cabinet.dto.ClubInfoResponseDto;
import org.ftclub.cabinet.dto.ClubPaginationResponseDto;
import org.ftclub.cabinet.dto.MandateClubMasterRequestDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.UserSession;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/clubs")
@Logging
public class ClubController {

	private final ClubFacadeService clubFacadeService;

	@AuthGuard(level = AuthLevel.USER_ONLY)
	@GetMapping("")
	public ClubPaginationResponseDto getMyClubs(@UserSession UserSessionDto user) {
		return clubFacadeService.getMyClubs(user.getUserId());
	}

	@AuthGuard(level = AuthLevel.USER_ONLY)
	@GetMapping("/{clubId}")
	public ClubInfoResponseDto getClubInfo(@UserSession UserSessionDto user,
			@PathVariable Long clubId,
			@Valid Pageable pageable) {
		return clubFacadeService.getClubInfo(user.getUserId(), clubId, pageable);
	}

	@AuthGuard(level = AuthLevel.USER_ONLY)
	@PostMapping("/{clubId}/users")
	public void addClubUser(@UserSession UserSessionDto user,
			@PathVariable Long clubId,
			@Valid @RequestBody AddClubUserRequestDto addClubUserRequestDto) {
		clubFacadeService.addClubUser(user.getUserId(), clubId, addClubUserRequestDto.getName());
	}

	@AuthGuard(level = AuthLevel.USER_ONLY)
	@DeleteMapping("/{clubId}/users/{userId}")
	public void deleteClubUser(@UserSession UserSessionDto user,
			@PathVariable Long clubId,
			@PathVariable Long userId) {
		clubFacadeService.deleteClubUser(user.getUserId(), clubId, userId);
	}

	@AuthGuard(level = AuthLevel.USER_ONLY)
	@PostMapping("/{clubId}/mandate")
	public void mandateClubUser(@UserSession UserSessionDto user,
			@PathVariable Long clubId,
			@Valid @RequestBody MandateClubMasterRequestDto mandateClubMasterRequestDto) {
		clubFacadeService.mandateClubUser(user.getUserId(), clubId,
				mandateClubMasterRequestDto.getClubMaster());
	}
}
