package org.ftclub.cabinet.config.security;

public class SecurityPathPatterns {

	public static final String[] PUBLIC_ENDPOINTS = {
			"/",
			"/demo",
			"/ping",
			"actuator/**",
			"/favicon.ico",
			"/v4/auth/**",
			"/v5/auth/**",
			"/v5/jwt/reissue",
			"/v4/admin/auth/login"
	};

	public static final String[] ADMIN_ENDPOINTS = {
			"/slack/**",
			"/v4/admin/**",
			"/v5/admin/**"
	};

	public static final String[] USER_ADMIN_ENDPOINTS = {
			"/v4/cabinets/**",
			"/v4/items",
			"/v4/lent/cabinets/share/cancel/*"
	};

	public static final String[] USER_AGU_ENDPOINTS = {
			"/v4/lent/me"
	};

	private SecurityPathPatterns() {
	}
}
