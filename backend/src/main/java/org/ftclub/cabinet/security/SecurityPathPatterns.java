package org.ftclub.cabinet.security;

public class SecurityPathPatterns {

	public static final String[] PUBLIC_ENDPOINTS = {
			"/",
			"/demo",
			"/ping",
			"/actuator/**",
			"/favicon.ico",

			"/v5/auth/agu/**",
			"/v4/admin/auth/**",

			"/v5/jwt/reissue",
	};

	public static final String[] ADMIN_ENDPOINTS = {
			"/slack/**",
			"/v4/admin/**",
			"/v5/admin/**",
			"/v6/admin/**"
	};

	public static final String[] AGU_ENDPOINTS = {
			"/v4/lent/me",
			"/v4/lent/return"
	};

	private SecurityPathPatterns() {
	}
}
