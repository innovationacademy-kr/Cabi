package org.ftclub.cabinet.auth.domain;

import java.util.Map;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.security.exception.SpringSecurityException;

/**
 * oauth 로그인 후 공통적으로 사용하는 필드를 세팅합니다.
 * <p>
 * provider: oauth 로그인 경로
 * <p>
 * userId: oauth에서 발급한 고유 Id
 * <p>
 * attribute: oauth별로 사용한 정보들
 */
@Slf4j
@ToString
@Getter
@Builder
public class Oauth2Attributes {

	private final String provider;
	private final String name;
	private final String email;
	private final Map<String, Object> attributes;

	public Oauth2Attributes(String provider, String name, String email,
			Map<String, Object> attributes) {
		if (provider == null || name == null || email == null) {
			throw new SpringSecurityException(ExceptionStatus.INVALID_ARGUMENT);
		}
		this.provider = provider;
		this.name = name;
		this.email = email;
		this.attributes = attributes;
	}

	public static Oauth2Attributes of(String provider, Map<String, Object> attributes,
			String attributeKey) {
		if (provider.equals("google")) {
			return ofGoogle(attributes, attributeKey);
		}
		if (provider.equals("naver")) {
			return ofNaver(attributes, attributeKey);
		}
		if (provider.equals("kakao")) {
			return ofKakao(attributes, attributeKey);
		}
		if (provider.equals("github")) {
			return ofGithub(attributes, attributeKey);
		}
		if (provider.equals("ft")) {
			return ofFt(attributes, attributeKey);
		}
		throw new SpringSecurityException(ExceptionStatus.NOT_SUPPORT_OAUTH_TYPE);
	}

	private static Oauth2Attributes ofFt(Map<String, Object> attributes, String attributeKey) {
		return new Oauth2Attributes(
				"ft",
				(String) attributes.get(attributeKey),
				(String) attributes.get("email"),
				attributes
		);
	}

	private static Oauth2Attributes ofGithub(Map<String, Object> attributes, String attributeKey) {
		log.info("id = {}, email = {}", attributes.get(attributeKey), attributes.get("email"));
		String email = (String) attributes.get("email");
		return new Oauth2Attributes(
				"github",
				attributes.get(attributeKey).toString(),
				email == null ? (String) attributes.get("login") : email,
				attributes
		);
	}

	private static Oauth2Attributes ofKakao(Map<String, Object> attributes, String attributeKey) {
		Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
		return new Oauth2Attributes(
				"kakao",
				attributes.get(attributeKey).toString(),
				(String) kakaoAccount.get("email"),
				attributes
		);


	}

	private static Oauth2Attributes ofGoogle(Map<String, Object> attributes, String attributeKey) {
		return new Oauth2Attributes(
				"google",
				(String) attributes.get(attributeKey),
				(String) attributes.get("email"),
				attributes
		);
	}

	private static Oauth2Attributes ofNaver(Map<String, Object> attributes, String attributeKey) {
		Map<String, Object> response = (Map<String, Object>) attributes.get("response");
		return new Oauth2Attributes(
				"naver",
				(String) response.get(attributeKey),
				(String) response.get("email"),
				attributes
		);
	}

}
