package org.ftclub.cabinet.jwt.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.jwt.repository.JwtRedis;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class JwtRedisService {

	private final JwtRedis jwtRedis;

	public boolean isUsedAccessToken(Long userId, String accessToken) {
		String expiredAccessToken = jwtRedis.getExpiredAccessToken(String.valueOf(userId));

		return accessToken.equals(expiredAccessToken);
	}

	public boolean isUsedRefreshToken(Long userId, String refreshToken) {
		String refreshTokenInRedis = jwtRedis.getRefreshToken(String.valueOf(userId));

		return refreshToken.equals(refreshTokenInRedis);
	}

	public void addUsedTokens(Long userId, String accessToken, String refreshToken) {
		jwtRedis.saveExpiredAccessToken(String.valueOf(userId), accessToken);
		jwtRedis.saveRefreshToken(String.valueOf(userId), refreshToken);
	}

	public void addRefreshToken(Long userId, String refreshToken) {
		jwtRedis.saveRefreshToken(String.valueOf(userId), refreshToken);
	}
}
