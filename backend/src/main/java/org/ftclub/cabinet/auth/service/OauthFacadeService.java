package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import io.jsonwebtoken.Claims;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.auth.service.AdminAuthService;
import org.ftclub.cabinet.auth.domain.CustomOAuth2User;
import org.ftclub.cabinet.auth.domain.FtOauthProfile;
import org.ftclub.cabinet.auth.domain.OauthLink;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.dto.StateInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.ftclub.cabinet.security.exception.SpringSecurityException;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * OAuth 제공자와의 연동, 프로필 정보 변환, 사용자 연결 상태 관리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OauthFacadeService {


	private final UserFacadeService userFacadeService;
	private final AuthPolicyService authPolicyService;
	private final OauthProfileService oauthProfileService;
	private final AdminAuthService adminAuthService;
	private final OauthLinkFacadeService oauthLinkFacadeService;
	private final JwtService jwtService;
	private final OauthLinkQueryService oauthLinkQueryService;

	/**
	 * ft 로그인 핸들링
	 * <p>
	 * 42 api로부터 정보를 받아온 후, 없는 유저라면 생성합니다.
	 *
	 * @param rootNode ftProfile -> JsonNode
	 * @return 필요한 정보만 파싱한 객체 {@link OauthResult}
	 */
	public OauthResult handleFtLogin(JsonNode rootNode) {
		FtOauthProfile profile = oauthProfileService.convertJsonNodeToFtOauthProfile(rootNode);
		User user = userFacadeService.createOrUpdateUserFromProfile(profile);

		return new OauthResult(user.getId(), user.getRoles(), user.getEmail(),
				authPolicyService.getMainHomeUrl());
	}

	/**
	 * ft oauth 로그인 외에 로그인 시도
	 * <p>
	 * Custom Resolver 를 통해 얻은 state의 JWT 값을 파싱하고, 계정을 연동하거나 로그인합니다.
	 *
	 * @param oauth2User
	 * @param request
	 * @return
	 */
	@Transactional
	public OauthResult handleExternalOAuthLogin(CustomOAuth2User oauth2User,
			HttpServletRequest request) {

		String state = request.getParameter("state");
		Claims claims = jwtService.validateAndParseToken(state);
		StateInfoDto stateInfo = StateInfoDto.fromClaim(claims);
		String oauthMail = oauth2User.getEmail();

		// 관리자 로그인
		if (stateInfo.isAdminContext()) {
			return adminAuthService.handleAdminLogin(oauthMail);
		}
		// 신규 계정 연동
		if (stateInfo.isConnectionMode()) {
			return oauthLinkFacadeService.handleNewLinkUser(oauth2User, stateInfo);
		}
		// 일반 로그인
		Optional<OauthLink> oauthLink = oauthLinkQueryService.findByProviderIdAndProviderType(
				oauth2User.getName(),
				oauth2User.getProvider());
		if (oauthLink.isPresent()) {
			return oauthLinkFacadeService.handleExistingLinkedUser(oauthLink.get());
		}
		throw new SpringSecurityException(ExceptionStatus.NOT_FT_LINK_STATUS);
	}

}
