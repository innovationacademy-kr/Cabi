package org.ftclub.cabinet.security;

import java.util.List;

public class SecurityPathPatterns {

	/**
	 * endpoints for public : not accessing the database
	 */
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

			"/latest/meta-data/iam/security-credentials/**",
	};

	/**
	 * endpoints for presentation public services : almost GET method, accessing the database
	 */
	public static final String[] ANONYMOUS_ENDPOINTS = {
			"/v6/presentations/**",
	};

	/**
	 * endpoints for user services not anonymous
	 */
	public static final String[] NON_ANONYMOUS_ENDPOINTS = {
			"/v6/presentations/me/**",
	};

	/**
	 * endpoints for admin services
	 */
	public static final String[] ADMIN_ENDPOINTS = {
			"/v4/admin/**",
			"/v5/admin/**",
			"/v6/admin/**"
	};

	/**
	 * endpoints for admin and user shared services
	 */
	public static final String[] ADMIN_USER_ENDPOINTS = {
			"/v4/cabinets/**",  // GET
			"/v4/lent/cabinets/share/cancel/{cabinetId}",   // PATCH
			"/v5/items",    // GET
			"/v5/presentation/form/invalid-date"    // GET
	};

	/**
	 * endpoints for AGU services : accessing the database
	 */
	public static final String[] AGU_ENDPOINTS = {
			"/v4/lent/me",
			"/v4/lent/return"
	};

	/**
	 * endpoints for CSRF
	 */
	public static final List<String> CSRF_ENDPOINTS = List.of(
			"/logout",
			"/jwt"
	);

	private SecurityPathPatterns() {
	}
}
