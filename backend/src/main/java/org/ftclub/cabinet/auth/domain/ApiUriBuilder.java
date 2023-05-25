package org.ftclub.cabinet.auth.domain;

import lombok.Builder;

/**
 * API URI를 생성하는 빌더 클래스입니다.
 */
@Builder
public class ApiUriBuilder {

	private final String authUri;
	private final String clientId;
	private final String redirectUri;
	private final String scope;
	private final String grantType;

	/**
	 * 로그인 리다이렉션을 위한 인증 URI를 생성합니다.
	 * <p>
	 * 인증 URI, 클라이언트 ID, 리다이렉트 URI, 스코프, 인증 방식을 이용하여 빌드된 빌더로 uri를 생성합니다.
	 *
	 * @return 인증 URI
	 */
	public String getCodeRequestUri() {
		return String.format("%s?client_id=%s&redirect_uri=%s&scope=%s&response_type=%s",
				authUri, clientId, redirectUri, scope, grantType);
	}
}
