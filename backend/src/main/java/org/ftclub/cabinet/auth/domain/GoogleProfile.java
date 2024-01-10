package org.ftclub.cabinet.auth.domain;

import lombok.Builder;
import lombok.Getter;

/**
 * 구글 OAuth 로그인을 통해 서비스에서 사용하는 프로필 정보를 담는 클래스입니다.
 */
@Builder
@Getter
public class GoogleProfile {
	private final String email;
}
