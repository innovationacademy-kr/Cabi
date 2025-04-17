package org.ftclub.cabinet.jwt.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.auth.service.CookieService;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.security.exception.SpringSecurityException;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

	private final JwtProvider tokenProvider;
	private final AdminQueryService adminQueryService;
	private final JwtRedisService jwtRedisService;
	private final UserQueryService userQueryService;
	private final CookieService cookieService;


	/**
	 * 토큰 파싱 후 정보를 담은 객체 반환
	 *
	 * @param token
	 * @return
	 */
	public UserInfoDto validateTokenAndGetUserInfo(String token) {
		try {
			Claims claims = tokenProvider.parseToken(token);
			return UserInfoDto.fromClaims(claims);
		} catch (ExpiredJwtException e) {
			throw new SpringSecurityException(ExceptionStatus.EXPIRED_JWT_TOKEN);
		} catch (JwtException e) {
			log.info("JwtException : {}", e.getMessage(), e);
			throw new SpringSecurityException(ExceptionStatus.JWT_EXCEPTION);
		} catch (DomainException e) {
			log.info("Claims has null value : {}", e.getMessage());
			throw new SpringSecurityException(ExceptionStatus.INVALID_ARGUMENT);
		}
	}

	public Claims validateAndParseToken(String token) {
		try {
			return tokenProvider.parseToken(token);
		} catch (ExpiredJwtException e) {
			throw new SpringSecurityException(ExceptionStatus.EXPIRED_JWT_TOKEN);
		} catch (JwtException e) {
			log.info("JwtException : {}", e.getMessage(), e);
			throw new SpringSecurityException(ExceptionStatus.JWT_EXCEPTION);
		} catch (DomainException e) {
			log.info("Claims has null value : {}", e.getMessage());
			throw new SpringSecurityException(ExceptionStatus.INVALID_ARGUMENT);
		}
	}

	/**
	 * AGU 토큰 발급
	 *
	 * @param userId
	 * @return
	 */
	public String createAguToken(Long userId) {
		Claims claims = Jwts.claims();

		claims.put(JwtTokenConstants.USER_ID, userId);
		claims.put(JwtTokenConstants.ROLES, "AGU");
		claims.put(JwtTokenConstants.OAUTH, "Temporary");

		return tokenProvider.createAguToken(claims);
	}

	/**
	 * access, refresh 토큰을 생성해 객체로 반환
	 *
	 * @param userId
	 * @param roles
	 * @param provider
	 * @return
	 */
	public TokenDto createPairTokens(Long userId, String roles, String provider) {
		Claims claims = Jwts.claims();

		claims.put(JwtTokenConstants.USER_ID, userId);
		claims.put(JwtTokenConstants.ROLES, roles);
		claims.put(JwtTokenConstants.OAUTH, provider);

		TokenDto tokens = tokenProvider.createAccessAndRefreshToken(claims);

		if (roles.contains(AdminRole.ADMIN.name()) || roles.contains(AdminRole.MASTER.name())) {
			jwtRedisService.addAdminRefreshToken(userId, tokens.getRefreshToken());
		} else {
			jwtRedisService.addRefreshToken(userId, tokens.getRefreshToken());
		}
		return tokens;
	}

	public String generateToken(Claims claims, Long validity) {
		return tokenProvider.createToken(claims, validity);
	}


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
	 * @return
	 */
	public TokenDto reissueToken(HttpServletRequest req, HttpServletResponse res) {
		String accessToken = extractToken(req);
		if (accessToken == null) {
			throw ExceptionStatus.JWT_TOKEN_NOT_FOUND.asServiceException();
		}

		try {
			Claims claims = parseClaimsEvenIfExpired(accessToken);
			UserInfoDto userInfoDto = UserInfoDto.fromClaims(claims);
			log.info("Role = {}", userInfoDto.getRoles());

			if (userInfoDto.hasRole(AdminRole.ADMIN.name())
					|| userInfoDto.hasRole(AdminRole.MASTER.name())) {
				return reissueAdminToken(req, res, accessToken, userInfoDto);
			}

			return reissueUserToken(req, res, accessToken, userInfoDto);
		} catch (JwtException e) {
			cookieService.deleteAllCookies(req.getCookies(), req.getServerName(), res);
			throw ExceptionStatus.JWT_EXCEPTION.asServiceException();
		}
	}

	public Claims parseClaimsEvenIfExpired(String token) {
		try {
			return tokenProvider.parseToken(token);
		} catch (ExpiredJwtException e) {
			return e.getClaims();
		}
	}

	public boolean isValidToken(String token) {
		try {
			tokenProvider.parseToken(token);
			return true;
		} catch (SecurityException | MalformedJwtException e) {
			log.warn("Invalid JWT signature or malformed token: {}", e.getMessage());
		} catch (ExpiredJwtException e) {
			log.warn("Expired JWT token: {}", e.getMessage());
		} catch (UnsupportedJwtException e) {
			log.warn("Unsupported JWT token: {}", e.getMessage());
		} catch (IllegalArgumentException e) {
			log.warn("JWT claims string is empty: {}", e.getMessage());
		}
		return false;
	}

	/**
	 * admin 토큰을 재발급합니다
	 * <p>
	 * 사용된 토큰인지 검증 후 새로운 토큰 발급, 이전 토큰 blackList에 추가
	 *
	 * @param req
	 * @param res
	 * @param userInfoDto refreshToken parse를 통해 생성한 유저 정보
	 * @return {@link TokenDto} 새로 생성한 토큰 객체
	 */
	private TokenDto reissueAdminToken(HttpServletRequest req, HttpServletResponse res,
			String accessToken,
			UserInfoDto userInfoDto) {
		Admin admin = adminQueryService.getById(userInfoDto.getUserId());

		if (jwtRedisService.isUsedAdminAccessToken(admin.getId(), accessToken)) {
			throw ExceptionStatus.JWT_ALREADY_USED.asServiceException();
		}
		String activeRefreshToken = jwtRedisService.getAdminRefreshToken(admin.getId());
		if (!isValidToken(activeRefreshToken)) {
			throw ExceptionStatus.JWT_EXPIRED.asServiceException();
		}

		TokenDto tokens = createPairTokens(admin.getId(), admin.getRole().name(),
				userInfoDto.getOauth());

		cookieService.setAccessTokenCookiesToClient(res, tokens, req.getServerName());
		jwtRedisService.addAdminAccessTokenToBlackList(admin.getId(), accessToken);
		jwtRedisService.addAdminRefreshToken(admin.getId(), tokens.getRefreshToken());
		return tokens;
	}

	/**
	 * user 토큰을 재발급합니다
	 * <p>
	 * 사용된 토큰인지 검증 후 새로운 토큰 발급, 이전 토큰 blackList에 추가
	 *
	 * @param req
	 * @param res
	 * @param userInfoDto refreshToken parse를 통해 생성한 유저 정보
	 * @return {@link TokenDto} 새로 생성한 토큰 객체
	 */
	private TokenDto reissueUserToken(HttpServletRequest req, HttpServletResponse res,
			String accessToken,
			UserInfoDto userInfoDto) {
		User user = userQueryService.getUser(userInfoDto.getUserId());

		if (jwtRedisService.isUsedAccessToken(user.getId(), accessToken)) {
			throw ExceptionStatus.JWT_ALREADY_USED.asServiceException();
		}
		String activeRefreshToken = jwtRedisService.getUserRefreshToken(user.getId());
		if (!isValidToken(activeRefreshToken)) {
			throw ExceptionStatus.JWT_EXPIRED.asServiceException();
		}

		TokenDto tokens = createPairTokens(user.getId(), user.getRoles(), userInfoDto.getOauth());

		cookieService.setAccessTokenCookiesToClient(res, tokens, req.getServerName());
		jwtRedisService.addUserAccessTokenToBlackList(user.getId(), accessToken);
		jwtRedisService.addUserRefreshToken(user.getId(), tokens.getRefreshToken());
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


