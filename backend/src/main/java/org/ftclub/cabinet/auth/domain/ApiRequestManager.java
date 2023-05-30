package org.ftclub.cabinet.auth.domain;

import org.ftclub.cabinet.config.ApiProperties;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * API 요청을 관리하는 매니저 클래스입니다.
 */
public class ApiRequestManager {

	/**
	 * API 프로퍼티를 주입받아 사용합니다. OAuth 2.0 기준으로 작동합니다.
	 */
	private final ApiProperties apiProperties;

	protected ApiRequestManager(ApiProperties apiProperties) {
		this.apiProperties = apiProperties;
	}

	public static ApiRequestManager of(ApiProperties apiProperties) {
		return new ApiRequestManager(apiProperties);
	}

	/**
	 * 로그인 리다이렉션을 위한 인증 URI를 생성합니다.
	 *
	 * @return 인증 URI
	 */
	public String getCodeRequestUri() {
		return String.format("%s?client_id=%s&redirect_uri=%s&scope=%s&response_type=%s",
				apiProperties.getAuthUri(),
				apiProperties.getClientId(),
				apiProperties.getRedirectUri(),
				apiProperties.getScope(),
				apiProperties.getGrantType());
	}

	/**
	 * AccessToken 요청을 위한 RequestBodyMap을 생성합니다.
	 *
	 * @param code 인증 코드
	 * @return AccessToken 요청을 위한 RequestBodyMap
	 */
	public MultiValueMap<String, String> getAccessTokenRequestBodyMap(String code) {
		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		map.add("client_id", apiProperties.getClientId());
		map.add("client_secret", apiProperties.getClientSecret());
		map.add("redirect_uri", apiProperties.getRedirectUri());
		map.add("grant_type", "authorization_code");
		map.add("code", code);
		return map;
	}


}
