package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

	private final ObjectMapper objectMapper;

	/**
	 * oauth 로그인을 마친 유저의 프로필을 해당 사이트로부터 받아온 후
	 * <p>
	 * Authentication 객체를 반환합니다.
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
			// oauth 로그인 위치 ex) google, ft
			String provider = userRequest.getClientRegistration().getRegistrationId();
			// 고유 id ex) 42 -> intraName, google -> uid
			String userId = oAuth2User.getName();

			return new CustomOauth2User(provider, userId, oAuth2User.getAttributes(), null);
		} catch (OAuth2AuthenticationException e) {
			log.error("OAuth2 Authentication Exception : {}", e.getMessage(), e);
			throw ExceptionStatus.INVALID_AUTHORIZATION.asSpringSecurityException();
		}
	}
}
