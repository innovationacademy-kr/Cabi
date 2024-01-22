package org.ftclub.cabinet.club.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.club.service.ClubFacadeService;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.UserSession;
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
	@PostMapping("{clubId}/new-user")
	public void addClubUser(@UserSession UserSessionDto user,
			@PathVariable Long clubId,
			@RequestBody String name) {
		clubFacadeService.addClubUser(user.getUserId(), clubId, name);
	}
}
