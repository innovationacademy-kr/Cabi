package org.ftclub.cabinet.jwt.repository;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.jwt.domain.JwtTokenProperties;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class JwtRedis {

	private static final String USER_JWT_ACCESS_KEY_SUFFIX = ":usedUserAccessToken";
	private static final String ADMIN_JWT_ACCESS_KEY_SUFFIX = ":usedAdminAccessToken";
	private static final String USER_JWT_REFRESH_KEY_SUFFIX = ":usedUserRefreshToken";
	private static final String ADMIN_JWT_REFRESH_KEY_SUFFIX = ":usedAdminRefreshToken";

	private final RedisTemplate<String, String> jwtTemplate;
	private final JwtTokenProperties jwtTokenProperties;

	public void saveUserAccessToken(String userId, String token) {
		jwtTemplate.opsForValue()
				.set(userId + USER_JWT_ACCESS_KEY_SUFFIX,
						token,
						jwtTokenProperties.getAccessExpiry()
				);
	}

	public void saveAdminAccessToken(String userId, String accessToken) {
		jwtTemplate.opsForValue()
				.set(userId + ADMIN_JWT_ACCESS_KEY_SUFFIX,
						accessToken,
						jwtTokenProperties.getAccessExpiry())
		;
	}

	public String getUserAccessToken(String userId) {
		String key = userId + USER_JWT_ACCESS_KEY_SUFFIX;
		return jwtTemplate.opsForValue().get(key);
	}

	public void saveUserRefreshToken(String userId, String refreshToken) {
		jwtTemplate.opsForValue()
				.set(userId + USER_JWT_REFRESH_KEY_SUFFIX,
						refreshToken,
						jwtTokenProperties.getRefreshExpiry()
				);
	}

	public void saveAdminRefreshToken(String userId, String accessToken) {
		jwtTemplate.opsForValue()
				.set(userId + ADMIN_JWT_REFRESH_KEY_SUFFIX,
						accessToken,
						jwtTokenProperties.getRefreshExpiry())
		;
	}

	public String getUserRefreshToken(String userId) {
		String key = userId + USER_JWT_REFRESH_KEY_SUFFIX;

		return jwtTemplate.opsForValue().get(key);
	}

	public String getAdminAccessToken(String adminId) {
		String key = adminId + ADMIN_JWT_ACCESS_KEY_SUFFIX;

		return jwtTemplate.opsForValue().get(key);
	}

	public String getAdminRefreshToken(String adminId) {
		String key = adminId + ADMIN_JWT_REFRESH_KEY_SUFFIX;

		return jwtTemplate.opsForValue().get(key);
	}
}
