package org.ftclub.cabinet.admin.auth.service;

import java.io.IOException;
import java.time.LocalDateTime;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.dto.AccessTokenDto;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.domain.JwtTokenProperties;
import org.ftclub.cabinet.jwt.service.JwtRedisService;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

	private final CookieManager cookieManager;
	private final AuthPolicyService authPolicyService;
	private final AdminQueryService adminQueryService;
	private final JwtService jwtService;
	private final JwtTokenProperties jwtTokenProperties;
	private final JwtRedisService jwtRedisService;

	@Value("${cabinet.server.be-host}")
	private String beHost;

	/**
	 * google Oauth 통한 Admin 로그인
	 *
	 * @param req
	 * @param res
	 * @throws IOException
	 */
	public void requestAdminLogin(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		// 쿠키에 로그인 현상 저장
		Cookie cookie = cookieManager.cookieOf("login_source", "admin");
		cookie.setMaxAge(15);
		cookie.setSecure(true);
		cookie.setHttpOnly(true);
		cookieManager.setCookieToClient(res, cookie, "/", req.getServerName());

		res.sendRedirect(beHost + "/oauth2/authorization/google");
	}

	/**
	 * 마스터 로그인을 처리합니다.
	 * <p>
	 * 정적으로 설정된 마스터 계정 정보와 일치하는지 확인합니다.
	 *
	 * @param masterLoginDto 마스터 로그인 정보 {@link MasterLoginDto}
	 * @param req            요청 시의 서블렛 {@link HttpServletRequest}
	 * @param res            요청 시의 서블렛 {@link HttpServletResponse}
	 * @param now            현재 시각
	 */
	public AccessTokenDto masterLogin(MasterLoginDto masterLoginDto, HttpServletRequest req,
			HttpServletResponse res, LocalDateTime now) {

		if (!authPolicyService.isMatchWithMasterAuthInfo(masterLoginDto.getId(),
				masterLoginDto.getPassword())) {
			throw ExceptionStatus.UNAUTHORIZED_ADMIN.asServiceException();
		}
		Admin master = adminQueryService.findByEmail(authPolicyService.getMasterEmail())
				.orElseThrow(ExceptionStatus.UNAUTHORIZED_ADMIN::asServiceException);
		TokenDto masterToken =
				jwtService.createTokens(master.getId(), master.getRole().name(), "master");
		Cookie cookie =
				cookieManager.cookieOf(JwtTokenConstants.REFRESH_TOKEN,
						masterToken.getRefreshToken());
		cookie.setHttpOnly(true);
		cookie.setSecure(true);
		cookie.setMaxAge(jwtTokenProperties.getRefreshExpirySeconds());
		cookieManager.setCookieToClient(res, cookie, "/", req.getServerName());
		return new AccessTokenDto(masterToken.getAccessToken());
	}


	/**
	 * 관리자 로그아웃을 처리합니다.
	 * <p>
	 * 쿠키에 저장된 관리자 토큰을 제거합니다.
	 *
	 * @param res 요청 시의 서블렛 {@link HttpServletResponse}
	 */
	public void adminLogout(
			HttpServletRequest request,
			HttpServletResponse response,
			Long userId,
			String refreshToken) throws IOException {

		// TODO: admin 토큰 폐기도 처리해야함 accessToken, refreshToken 사용 처리
		String accessToken = jwtService.extractToken(request);
		if (accessToken != null && refreshToken != null) {
			jwtRedisService.addUsedAdminTokensToBlackList(userId, accessToken, refreshToken);
		}
		// 내부 모든 쿠키 삭제
		cookieManager.deleteAllCookies(request.getCookies(), response);
	}

}
