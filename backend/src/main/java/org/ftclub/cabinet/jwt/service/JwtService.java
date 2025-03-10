package org.ftclub.cabinet.jwt.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {

	private final JwtProvider tokenProvider;
	private final AdminQueryService adminQueryService;
	private final JwtRedisService jwtRedisService;
	private final CookieManager cookieManager;
	private final UserQueryService userQueryService;


	/**
	 * 토큰을 재발급합니다.
	 * <p>
	 * 1. access, refreshToken 검증 후 새 토큰 발급
	 * <p>
	 * 2. 사용된 토큰을 블랙리스트에 추가
	 * <p>
	 * 3. 새 토큰을 쿠키에 설정
	 *
	 * @param req
	 * @param res
	 * @param refreshToken
	 * @return
	 */
	public TokenDto reissueToken(HttpServletRequest req, HttpServletResponse res,
			String refreshToken) {
		String accessToken = extractToken(req);
		if (accessToken == null || refreshToken == null) {
			throw ExceptionStatus.JWT_TOKEN_NOT_FOUND.asServiceException();
		}

		try {
			Claims claims = tokenProvider.parseToken(refreshToken);
			UserInfoDto userInfoDto = UserInfoDto.fromClaims(claims);
			TokenDto currentTokens = new TokenDto(accessToken, refreshToken);

			if (userInfoDto.getRoles().contains(AdminRole.ADMIN.name())) {
				return reissueAdminToken(req, res, currentTokens, userInfoDto);
			}

			return reissueUserToken(req, res, currentTokens, userInfoDto);
		} catch (ExpiredJwtException e) {
			throw ExceptionStatus.EXPIRED_JWT_TOKEN.asServiceException();
		} catch (JwtException e) {
			throw ExceptionStatus.JWT_EXCEPTION.asServiceException();
		}
	}

	private TokenDto reissueAdminToken(HttpServletRequest req, HttpServletResponse res,
			TokenDto currentTokens, UserInfoDto userInfoDto) {
		Admin admin = adminQueryService.getById(userInfoDto.getUserId());

		if (jwtRedisService.isUsedAdminAccessToken(admin.getId(), currentTokens.getAccessToken())
				|| jwtRedisService.isUsedAdminRefreshToken(admin.getId(),
				currentTokens.getRefreshToken())) {
			throw ExceptionStatus.JWT_ALREADY_USED.asServiceException();
		}
		TokenDto tokens = tokenProvider.createAccessAndRefreshToken(
				admin.getId(), admin.getRole().name(), userInfoDto.getOauth());

		cookieManager.setTokenCookies(res, tokens, req.getServerName());
		jwtRedisService.addUsedAdminTokens(
				admin.getId(), currentTokens.getAccessToken(), currentTokens.getRefreshToken());
		return tokens;
	}

	private TokenDto reissueUserToken(HttpServletRequest req, HttpServletResponse res,
			TokenDto currentTokens, UserInfoDto userInfoDto) {
		User user = userQueryService.getUser(userInfoDto.getUserId());

		if (jwtRedisService.isUsedAccessToken(user.getId(), currentTokens.getAccessToken())
				|| jwtRedisService.isUsedRefreshToken(user.getId(),
				currentTokens.getRefreshToken())) {
			throw ExceptionStatus.JWT_ALREADY_USED.asServiceException();
		}
		TokenDto tokens = tokenProvider.createAccessAndRefreshToken(
				user.getId(), user.getRoles(), userInfoDto.getOauth());

		cookieManager.setTokenCookies(res, tokens, req.getServerName());
		jwtRedisService.addUserUsedTokens(
				user.getId(), currentTokens.getAccessToken(), currentTokens.getRefreshToken());
		return tokens;
	}

	/**
	 * 헤더로부터 JWT 추출
	 *
	 * @param req 요청 시의 서블렛 {@link HttpServletRequest}
	 * @return
	 */
	public String extractToken(HttpServletRequest req) {
		String header = req.getHeader(HttpHeaders.AUTHORIZATION);
		if (header == null || !header.startsWith(JwtTokenConstants.BEARER)) {
			return null;
		}

		return header.substring(JwtTokenConstants.BEARER.length());
	}
}


