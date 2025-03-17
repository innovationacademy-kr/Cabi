package org.ftclub.cabinet.auth.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 쿠키 생성 시 필요한 필수적인 세팅값
 */
@AllArgsConstructor
@Getter
public class CookieInfo {

	private final String serverName;
	private final int maxAge;
	private final boolean isHttpOnly;
}
