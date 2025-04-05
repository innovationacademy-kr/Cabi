package org.ftclub.cabinet.auth.service;

import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.CustomOAuth2User;
import org.ftclub.cabinet.auth.domain.FtOauthProfile;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.domain.OauthLink;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
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
	private final JwtService jwtService;
	private final UserQueryService userQueryService;
	private final AuthPolicyService authPolicyService;
	private final CookieService cookieService;
	private final UserCommandService userCommandService;

	/**
	 * providerId(unique), type을 기준으로 계정 연동 상태를 확인한 후,
	 * <p>
	 * 새로 연동하거나 유저 정보(role, blackholedAt)를 업데이트 합니다
	 *
	 * @param req
	 * @param oauth2User
	 * @return
	 */
	public OauthResult handleLinkUser(HttpServletRequest req,
			CustomOAuth2User oauth2User) {
		String oauthMail = oauth2User.getEmail();
		String providerId = oauth2User.getName();
		String providerType = oauth2User.getProvider();
		Optional<OauthLink> result = oauthLinkQueryService.findByProviderIdAndProviderType(
				providerId, providerType);
		String refreshToken = cookieService.getCookieValue(req, JwtTokenConstants.REFRESH_TOKEN);

		// 계정 연동 클릭했는디 이미 연동당한 계정임
		if (refreshToken != null && result.isPresent()) {
			throw new SpringSecurityException(ExceptionStatus.OAUTH_EMAIL_ALREADY_LINKED);
		}
		return result.map(this::handleExistingLinkedUser)
				.orElseGet(() -> handleNewLinkUser(req, providerType, providerId, oauthMail));
	}

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
				user.getId(), user.getRoles(),
				authPolicyService.getMainHomeUrl());
	}

	/**
	 * 신규 계정 연동 유저 생성
	 * <p>
	 * refreshToken으로부터 서비스에 가입한 유저인지 확인 및 loginStatus 확인
	 *
	 * @param req
	 * @param providerType
	 * @param providerId
	 * @param oauthMail
	 * @return
	 */
	public OauthResult handleNewLinkUser(HttpServletRequest req, String providerType,
			String providerId, String oauthMail) {

		String refreshToken = cookieService.getCookieValue(req, JwtTokenConstants.REFRESH_TOKEN);
		if (refreshToken == null) {
			throw new SpringSecurityException(ExceptionStatus.NOT_FT_LINK_STATUS);
		}

		UserInfoDto userInfoDto = jwtService.validateTokenAndGetUserInfo(refreshToken);
		User user = userQueryService.getUser(userInfoDto.getUserId());
		if (oauthLinkQueryService.isExistByUserId(userInfoDto.getUserId())) {
			throw new SpringSecurityException(ExceptionStatus.OAUTH_EMAIL_ALREADY_LINKED);
		}
		OauthLink connection =
				OauthLink.of(user, providerType, providerId, oauthMail);
		oauthLinkCommandService.save(connection);
		return new OauthResult(user.getId(), user.getRoles(), authPolicyService.getProfileUrl());
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
}
