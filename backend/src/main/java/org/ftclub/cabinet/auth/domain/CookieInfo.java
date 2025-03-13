package org.ftclub.cabinet.auth.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CookieInfo {

	private final String serverName;
	private final int maxAge;
	private final boolean isHttpOnly;
}
