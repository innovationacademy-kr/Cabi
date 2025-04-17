package org.ftclub.cabinet.jwt.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
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

	public boolean isUsedAdminAccessToken(Long adminId, String accessToken) {
		String expiredAccessToken = jwtRedis.getAdminAccessToken(String.valueOf(adminId));

		return accessToken.equals(expiredAccessToken);
	}


	// white List
	public void addRefreshToken(Long id, String refreshToken) {
		jwtRedis.saveUserRefreshToken(String.valueOf(id), refreshToken);
	}

	public String getUserRefreshToken(Long id) {

		String userRefreshToken = jwtRedis.getUserRefreshToken(String.valueOf(id));
		if (userRefreshToken == null) {
			throw ExceptionStatus.JWT_TOKEN_NOT_FOUND.asServiceException();
		}
		return userRefreshToken;
	}

	public void addUserAccessTokenToBlackList(Long id, String accessToken) {
		jwtRedis.saveUserAccessToken(String.valueOf(id), accessToken);
	}

	public void addUserRefreshToken(Long id, String refreshToken) {
		jwtRedis.saveUserRefreshToken(String.valueOf(id), refreshToken);
	}

	public void addAdminAccessTokenToBlackList(Long id, String accessToken) {
		jwtRedis.saveAdminAccessToken(String.valueOf(id), accessToken);
	}

	public void addAdminRefreshToken(Long id, String refreshToken) {
		jwtRedis.saveAdminRefreshToken(String.valueOf(id), refreshToken);
	}

	public String getAdminRefreshToken(Long id) {
		String adminAccessToken = jwtRedis.getAdminRefreshToken(String.valueOf(id));
		if (adminAccessToken == null) {
			throw ExceptionStatus.JWT_TOKEN_NOT_FOUND.asServiceException();
		}
		return adminAccessToken;
	}

	/**
	 * 로그아웃 시
	 *
	 * @param id
	 * @param accessToken
	 */
	public void handleLogoutAdminTokens(Long id, String accessToken) {
		jwtRedis.saveAdminAccessToken(String.valueOf(id), accessToken);
		jwtRedis.deleteAdminRefreshToken(String.valueOf(id));
	}

	public void handleLogoutUserTokens(Long id, String accessToken) {
		jwtRedis.saveUserAccessToken(String.valueOf(id), accessToken);
		jwtRedis.deleteUserRefreshToken(String.valueOf(id));

	}
}
