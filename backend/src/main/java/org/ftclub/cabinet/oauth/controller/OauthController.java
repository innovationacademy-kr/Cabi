package org.ftclub.cabinet.oauth.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.OauthUnlinkRequestDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.auth.service.OauthLinkFacadeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v5/oauth")
@RequiredArgsConstructor
public class OauthController {

	private final OauthLinkFacadeService oauthLinkFacadeService;

	/**
	 * 계정 연동 해제
	 *
	 * @param userInfoDto
	 */
	@DeleteMapping("/link")
	public void unLinkOauthMail(@AuthenticationPrincipal UserInfoDto userInfoDto,
			@RequestBody OauthUnlinkRequestDto dto) {
		oauthLinkFacadeService.deleteOauthMail(userInfoDto.getUserId(), dto.getOauthMail(),
				dto.getProvider());
	}

}
