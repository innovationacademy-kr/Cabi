package org.ftclub.cabinet.security.handler;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.CustomOAuth2User;
import org.ftclub.cabinet.auth.domain.Oauth2Attributes;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {


	/**
	 * oauth 로그인을 마친 유저의 프로필을 해당 사이트로부터 받아온 후
	 * <p>
	 * Authentication 객체를 반환합니다.
	 * <p>
	 * 예외 발생시, entryPoint 에서 예외를 반환합니다.
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
			Map<String, Object> attributes = oAuth2User.getAttributes();

			if (attributes == null || attributes.isEmpty()) {
				throw new OAuth2AuthenticationException("API 서버에서 프로필 정보를 가져오는데 실패했습니다");
			}
			// oauth 로그인 위치 ex) google, ft
			String provider = userRequest.getClientRegistration().getRegistrationId();
			// 고유 Id가 담겨있는 value의 key
			String attributeKey = userRequest.getClientRegistration()
					.getProviderDetails()
					.getUserInfoEndpoint()
					.getUserNameAttributeName();

			Oauth2Attributes oauth2Attributes =
					Oauth2Attributes.of(provider, attributes, attributeKey);

			return new CustomOAuth2User(oauth2Attributes);
		} catch (OAuth2AuthenticationException e) {
			log.error("OAuth2 Authentication Exception : {}", e.getMessage(), e);
			throw e;
		} catch (Exception e) {
			log.error("OAuth2 Authentication Exception : {}", e.getMessage(), e);
			throw new OAuth2AuthenticationException("OAuth2 인증 실패");
		}
	}
}
