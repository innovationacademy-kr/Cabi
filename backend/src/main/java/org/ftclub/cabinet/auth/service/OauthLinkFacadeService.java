package org.ftclub.cabinet.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.CustomOAuth2User;
import org.ftclub.cabinet.auth.domain.FtOauthProfile;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.domain.OauthLink;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.dto.LinkOauthRedirectUrlServiceDto;
import org.ftclub.cabinet.dto.LinkOauthTokenDto;
import org.ftclub.cabinet.dto.StateInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.security.exception.SpringSecurityException;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Logging(level = LogLevel.DEBUG)
@RequiredArgsConstructor
public class OauthLinkFacadeService {


	private final OauthLinkQueryService oauthLinkQueryService;
	private final OauthLinkCommandService oauthLinkCommandService;
	private final OauthProfileService oauthProfileService;
	private final UserQueryService userQueryService;
	private final AuthPolicyService authPolicyService;
	private final UserCommandService userCommandService;
	private final JwtService jwtService;

	/**
	 * 기존 계정 연동 유저
	 * <p>
	 * 42 api를 통해 role, blackholedAt 업데이트. 42 api 호출 시 문제가 있을 경우 리트라이 없이 업데이트 생략
	 *
	 * @param connection
	 * @return
	 */
	public OauthResult handleExistingLinkedUser(OauthLink connection) {
		User user = connection.getUser();
		try {
			FtOauthProfile profile = oauthProfileService.getProfileByIntraName(user.getName());
			String roles = FtRole.combineRolesToString(profile.getRoles());

			userCommandService.updateUserRoleAndBlackHoledAt(user, roles,
					profile.getBlackHoledAt());
		} catch (Exception e) {
			log.info("42 API 호출 도중 에러발생. blackHole, role update 생략. "
							+ "name = {}, message = {}",
					user.getName(), e.getMessage());
		}
		return new OauthResult(
				user.getId(), user.getRoles(), connection.getEmail(),
				authPolicyService.getMainHomeUrl());
	}

	/**
	 * 신규 계정 연동
	 *
	 * @param oAuth2User   로그인 성공 후 oauth 로부터 받은 유저 정보
	 * @param stateInfoDto state 파라미터로부터 얻은 서비스 DB의 userPK 값
	 * @return
	 */
	public OauthResult handleNewLinkUser(CustomOAuth2User oAuth2User,
			StateInfoDto stateInfoDto) {

		User user = userQueryService.getUser(stateInfoDto.getUserId());
		if (oauthLinkQueryService.isExistByUserId(stateInfoDto.getUserId())) {
			throw new SpringSecurityException(ExceptionStatus.OAUTH_EMAIL_ALREADY_LINKED);
		}
		oauthLinkQueryService.findByProviderIdAndProviderType(
				oAuth2User.getName(),
				oAuth2User.getProvider()).ifPresent(link -> {
			throw new SpringSecurityException(ExceptionStatus.OAUTH_EMAIL_ALREADY_LINKED);
		});
		OauthLink connection =
				OauthLink.of(user, oAuth2User.getProvider(), oAuth2User.getName(),
						oAuth2User.getEmail());
		oauthLinkCommandService.save(connection);
		return new OauthResult(user.getId(), user.getRoles(), oAuth2User.getEmail(),
				authPolicyService.getProfileUrl());
	}

	/**
	 * 계정 연동을 해지합니다.
	 *
	 * @param userId
	 */
	@Transactional
	public void deleteOauthMail(Long userId, String oauthMail, String provider) {

		OauthLink connection = oauthLinkQueryService.getByUserId(userId);

		if (!connection.getProviderType().equals(provider)
				|| !connection.getEmail().equals(oauthMail)) {
			throw ExceptionStatus.INVALID_OAUTH_CONNECTION.asServiceException();
		}
		oauthLinkCommandService.softDelete(connection);
	}

	/**
	 * 계정 연동 시, 유저의 정보가 담긴 임시 토큰을 발급합니다.
	 *
	 * @param linkOauthRedirectUrlServiceDto
	 * @return
	 */
	public LinkOauthTokenDto generateRedirectUrl(
			LinkOauthRedirectUrlServiceDto linkOauthRedirectUrlServiceDto) {
		Long userId = linkOauthRedirectUrlServiceDto.getUserId();

		Claims claims = Jwts.claims();
		claims.put("userId", userId);
		claims.put("mode", "connect");
		String stateToken = jwtService.generateToken(claims, (long) 30 * 60 * 1000);

		return new LinkOauthTokenDto(stateToken);
	}
}
