package org.ftclub.cabinet.jwt.repository;

import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
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
	private Long accessTokenExpiration;
	private Long refreshTokenExpiration;

	public void saveExpiredAccessToken(String userId, String token) {
		jwtTemplate.opsForValue()
				.set(userId + JWT_ACCESS_KEY_SUFFIX,
						token,
						accessTokenExpiration,
						TimeUnit.MILLISECONDS
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
						refreshTokenExpiration,
						TimeUnit.MILLISECONDS
				);
	}

	public String getRefreshToken(String userId) {
		String key = userId + JWT_REFRESH_KEY_SUFFIX;
		
		return jwtTemplate.opsForValue().get(key);
	}
}
