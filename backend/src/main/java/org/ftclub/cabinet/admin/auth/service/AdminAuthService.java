package org.ftclub.cabinet.admin.auth.service;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.http.HttpHeaders;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.admin.admin.service.AdminCommandService;
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.auth.service.CookieService;
import org.ftclub.cabinet.dto.AccessTokenDto;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.service.JwtRedisService;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.ftclub.cabinet.security.exception.SpringSecurityException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

	private final AuthPolicyService authPolicyService;
	private final AdminQueryService adminQueryService;
	private final JwtService jwtService;
	private final JwtRedisService jwtRedisService;
	private final AdminCommandService adminCommandService;
	private final CookieService cookieService;
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
		cookieService.addAdminCookie(req, res);
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
	 */
	public AccessTokenDto masterLogin(MasterLoginDto masterLoginDto, HttpServletRequest req,
			HttpServletResponse res) {

		if (!authPolicyService.isMatchWithMasterAuthInfo(masterLoginDto.getId(),
				masterLoginDto.getPassword())) {
			throw ExceptionStatus.UNAUTHORIZED_ADMIN.asServiceException();
		}
		Admin master = adminQueryService.findByEmail(authPolicyService.getMasterEmail())
				.orElseThrow(ExceptionStatus.UNAUTHORIZED_ADMIN::asServiceException);
		TokenDto masterToken =
				jwtService.createPairTokens(master.getId(), master.getRole().name(), "master");
		cookieService.setPairTokenCookiesToClient(res, masterToken, req.getServerName());
		return new AccessTokenDto(masterToken.getAccessToken());
	}


	/**
	 * 관리자 로그아웃을 처리합니다.
	 * <p>
	 * 쿠키에 저장된 관리자 토큰을 제거합니다.
	 *
	 * @param response 요청 시의 서블렛 {@link HttpServletResponse}
	 */
	public void adminLogout(HttpServletRequest request, HttpServletResponse response) {

		String accessToken = jwtService.extractToken(request);
		String refreshToken =
				cookieService.getCookieValue(request, JwtTokenConstants.REFRESH_TOKEN);
		if (accessToken == null || refreshToken == null) {
			throw new SpringSecurityException(ExceptionStatus.JWT_TOKEN_NOT_FOUND);
		}
		UserInfoDto userInfoDto = jwtService.validateTokenAndGetUserInfo(refreshToken);
		if (!userInfoDto.hasRole(AdminRole.ADMIN.name())
				&& !userInfoDto.hasRole(AdminRole.MASTER.name())) {
			throw new SpringSecurityException(ExceptionStatus.FORBIDDEN_USER);
		}
		// 내부 모든 쿠키 및 토큰 삭제
		jwtRedisService.addUsedAdminTokensToBlackList(userInfoDto.getUserId(), accessToken,
				refreshToken);
		cookieService.deleteAllCookies(request.getCookies(),
				request.getHeader(HttpHeaders.HOST), response);
	}

	@Transactional
	public OauthResult handleAdminLogin(String adminMail) {
		Admin admin = adminQueryService.findByEmail(adminMail)
				.orElseGet(() -> adminCommandService.createAdminByEmail(adminMail));
		return new OauthResult(admin.getId(),
				admin.getRole().name(),
				authPolicyService.getAdminHomeUrl());
	}

}
