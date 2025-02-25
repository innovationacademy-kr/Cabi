package org.ftclub.cabinet.jwt.repository;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.security.JwtTokenProperties;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class JwtRedis {

	private static final String JWT_ACCESS_KEY_SUFFIX = ":usedAccessToken";
	private static final String JWT_REFRESH_KEY_SUFFIX = ":usedRefreshToken";
	private final RedisTemplate<String, String> jwtTemplate;
	private final JwtTokenProperties jwtTokenProperties;

	public void saveExpiredAccessToken(String userId, String token) {
		jwtTemplate.opsForValue()
				.set(userId + JWT_ACCESS_KEY_SUFFIX,
						token,
						jwtTokenProperties.getAccessExpiry()
				);
	}

	public String getExpiredAccessToken(String userId) {
		String key = userId + JWT_ACCESS_KEY_SUFFIX;
		return jwtTemplate.opsForValue().get(key);
	}

	public void saveRefreshToken(String userId, String refreshToken) {
		jwtTemplate.opsForValue()
				.set(userId + JWT_REFRESH_KEY_SUFFIX,
						refreshToken,
						jwtTokenProperties.getRefreshExpiry()
				);
	}

	public String getRefreshToken(String userId) {
		String key = userId + JWT_REFRESH_KEY_SUFFIX;

		return jwtTemplate.opsForValue().get(key);
	}
}
