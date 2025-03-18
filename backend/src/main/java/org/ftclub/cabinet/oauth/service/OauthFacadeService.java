package org.ftclub.cabinet.oauth.service;

import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.auth.service.AdminAuthService;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.oauth.domain.CustomOauth2User;
import org.ftclub.cabinet.oauth.domain.FtOauthProfile;
import org.ftclub.cabinet.oauth.domain.OauthResult;
import org.ftclub.cabinet.security.SecurityPathPolicyService;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.ftclub.cabinet.user.service.UserQueryService;
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
	private final UserQueryService userQueryService;
	private final AuthPolicyService authPolicyService;
	private final OauthProfileService oauthProfileService;
	private final SecurityPathPolicyService securityPathPolicy;
	private final AdminAuthService adminAuthService;
	private final OauthLinkFacadeService oauthLinkFacadeService;

	/**
	 * ft oauth 로그인 외에 로그인 시도
	 * <p>
	 * admin 페이지에서 요청이 왔을 경우 admin 계정연동 수행
	 * <p>
	 * 일반 유저일 경우 oauthLinkFacadeService 에서 연동 계정을 생성하거나, 정보를 업데이트합니다.
	 *
	 * @param oauth2User
	 * @param request
	 * @return
	 */
	@Transactional
	public OauthResult handleExternalOAuthLogin(CustomOauth2User oauth2User,
			HttpServletRequest request) {

		String oauthMail = oauth2User.getEmail();
		if (securityPathPolicy.isAdminContext()) {
			return adminAuthService.handleAdminLogin(oauthMail);
		}

		return oauthLinkFacadeService.handleLinkUser(request, oauth2User);
	}

	/**
	 * ft 로그인 핸들링
	 * <p>
	 * 42 api로부터 정보를 받아온 후, 없는 유저라면 생성합니다.
	 *
	 * @param rootNode ftProfile -> JsonNode
	 * @return 필요한 정보만 파싱한 객체 {@link OauthResult}
	 */
	@Transactional
	public OauthResult handleFtLogin(JsonNode rootNode) {
		FtOauthProfile profile = oauthProfileService.convertJsonNodeToFtOauthProfile(rootNode);
		User user =
				userFacadeService.createUserIfNotExistFromProfile(profile);
		userFacadeService.updateUserStatus(profile, user);

		return new OauthResult(user.getId(), user.getRoles(), authPolicyService.getMainHomeUrl());
	}

	/**
	 * public 로그인 요청 시 토큰을 발급합니다.
	 *
	 * @param name
	 * @throws IOException
	 */
	public OauthResult handlePublicLogin(String name) {
		User user = userQueryService.getUserByName(name);

		return new OauthResult(user.getId(), user.getRoles(), authPolicyService.getMainHomeUrl());
	}

}
