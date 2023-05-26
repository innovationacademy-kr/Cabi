package org.ftclub.cabinet.auth.domain;

import org.ftclub.cabinet.config.ApiProperties;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * API URI를 생성하는 빌더 클래스입니다.
 */
public class ApiRequestManager {

	private final ApiProperties apiProperties;

	protected ApiRequestManager(ApiProperties apiProperties) {
		this.apiProperties = apiProperties;
	}

	public static ApiRequestManager of(ApiProperties apiProperties) {
		return new ApiRequestManager(apiProperties);
	}

	/**
	 * 로그인 리다이렉션을 위한 인증 URI를 생성합니다.
	 * <p>
	 * 인증 URI, 클라이언트 ID, 리다이렉트 URI, 스코프, 인증 방식을 이용하여 빌드된 빌더로 uri를 생성합니다.
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
