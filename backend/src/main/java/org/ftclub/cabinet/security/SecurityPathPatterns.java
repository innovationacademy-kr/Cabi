package org.ftclub.cabinet.security;

import java.util.List;

public class SecurityPathPatterns {

	public static final String[] PUBLIC_ENDPOINTS = {
			"/",
			"/demo",
			"/ping",
			"/actuator/**",
			"/favicon.ico",

			"/v5/auth/agu/**",
			"/v5/auth/csrf",
			"/v4/admin/auth/**",

			"/jwt/reissue",
	};

	public static final String[] ADMIN_ENDPOINTS = {
			"/slack/**",
			"/v4/admin/**",
			"/v5/admin/**"
	};

	public static final String[] ADMIN_USER_ENDPOINTS = {
			"/v4/cabinets/**",
			"/v4/lent/cabinets/share/cancel/{cabinetId}",
			"/v5/items"
	};

	public static final String[] AGU_ENDPOINTS = {
			"/v4/lent/me",
			"/v4/lent/return"
	};

	public static final List<String> CSRF_ENDPOINTS = List.of(
			"/logout",
			"/jwt"
	);

	private SecurityPathPatterns() {
	}
}
