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
		String expiredAccessToken = jwtRedis.getUserAccessToken(String.valueOf(userId));

		return accessToken.equals(expiredAccessToken);
	}

	public boolean isUsedRefreshToken(Long userId, String refreshToken) {
		String refreshTokenInRedis = jwtRedis.getUserRefreshToken(String.valueOf(userId));

		return refreshToken.equals(refreshTokenInRedis);
	}

	public void addUserUsedTokens(Long userId, String accessToken, String refreshToken) {
		jwtRedis.saveUserAccessToken(String.valueOf(userId), accessToken);
		jwtRedis.saveUserRefreshToken(String.valueOf(userId), refreshToken);
	}

	public boolean isUsedAdminAccessToken(Long adminId, String accessToken) {
		String expiredAccessToken = jwtRedis.getAdminAccessToken(String.valueOf(adminId));

		return expiredAccessToken.equals(accessToken);
	}

	public boolean isUsedAdminRefreshToken(Long id, String refreshToken) {
		String expiredRefreshToken = jwtRedis.getAdminRefreshToken(String.valueOf(id));

		return expiredRefreshToken.equals(refreshToken);
	}

	public void addUsedAdminTokens(Long id, String accessToken, String refreshToken) {
		jwtRedis.saveAdminAccessToken(String.valueOf(id), accessToken);
		jwtRedis.saveAdminRefreshToken(String.valueOf(id), refreshToken);
	}
}
