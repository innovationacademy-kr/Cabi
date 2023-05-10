package org.ftclub.cabinet.auth;

import org.springframework.stereotype.Component;

/**
 * API URI를 생성하는 클래스입니다.
 */
@Component
public class ApiUriBuilder {

	/**
	 * 로그인 리다이렉션을 위한 인증 URI를 생성합니다.
	 *
	 * @param authUri     인증 URI
	 * @param clientId    클라이언트 ID
	 * @param redirectUri 리다이렉트 URI
	 * @param scope       스코프
	 * @param grantType   인증 방식
	 * @return 인증 URI
	 */
	public String buildCodeUri(String authUri, String clientId, String redirectUri, String scope,
			String grantType) {
		return String.format("%s?client_id=%s&redirect_uri=%s&scope=%s&response_type=%s",
				authUri, clientId, redirectUri, scope, grantType);
	}

	public String buildTokenUri(String authUri, String clientId, String clientSecret,
			String grantType, String redirectUri) {
		return String.format("%s?client_id=%s&client_secret=%s&grantType=%s&redirectUri=%s",
				authUri, clientId, clientSecret, grantType, redirectUri);
	}

	public String buildProfileUri(String userInfoUri, String accessToken) {
		return String.format("%s?access_token=%s",
				userInfoUri, accessToken);
	}
}
