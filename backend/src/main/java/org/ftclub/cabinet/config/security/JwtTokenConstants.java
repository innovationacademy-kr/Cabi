package org.ftclub.cabinet.config.security;

public class JwtTokenConstants {

	public static final String ACCESS_TOKEN = "access_token";
	public static final String REFRESH_TOKEN = "refresh_token";
	public static final String OAUTH = "oauth";
	public static final String USER_ID = "userId";
	public static final String ROLES = "roles";
	public static final String BEARER = "Bearer ";

	private JwtTokenConstants() {
		throw new UnsupportedOperationException("Utility class");
	}

}
