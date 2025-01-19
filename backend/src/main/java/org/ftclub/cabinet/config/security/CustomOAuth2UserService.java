package org.ftclub.cabinet.config.security;

import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

	private String ftOauthProvider;
	private String googleOauthProvider;

	/**
	 * oauth 로그인을 마친 유저의 프로필을 해당 사이트로부터 받아오고,
	 * <p>
	 * SecurityContextHolder 에 정보를 저장합니다.
	 * <p>
	 * 메서드들은 application.yml에 명시된 값들을 호출합니다
	 *
	 * @param userRequest
	 * @return
	 * @throws OAuth2AuthenticationException
	 */
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		try {
			OAuth2User oAuth2User = super.loadUser(userRequest);
			log.info("oauth Info = {}", oAuth2User);

			// oauth 로그인 위치
			String provider = userRequest.getClientRegistration().getRegistrationId();
			// 정보를 받아오는 키워드 ex) 42 oauth -> login
			String userNameAttribute =
					userRequest.getClientRegistration()
							.getProviderDetails()
							.getUserInfoEndpoint()
							.getUserNameAttributeName();
			String userId = (String) oAuth2User.getAttributes().get(userNameAttribute);
			log.info("userId = {}", userId);
			return oAuth2User;
		} catch (OAuth2AuthenticationException e) {
			log.error("OAuth2 Authentication Exception : {}", e.getMessage(), e);
			throw ExceptionStatus.INVALID_AUTHORIZATION.asSpringSecurityException();
		}
	}
}
