package org.ftclub.cabinet.auth.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.service.AdminCommandService;
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.auth.domain.AuthCookieManager;
import org.ftclub.cabinet.auth.domain.FtProfile;
import org.ftclub.cabinet.auth.domain.GoogleProfile;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.MasterProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.newService.UserCommandService;
import org.ftclub.cabinet.user.newService.UserQueryService;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class AuthFacadeService {

	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final AdminQueryService adminQueryService;
	private final AdminCommandService adminCommandService;
	private final UserOauthService userOauthService;
	private final AdminOauthService adminOauthService;

	private final TokenProvider tokenProvider;
	private final AuthCookieManager authCookieManager;
	private final DomainProperties domainProperties;
	private final MasterProperties masterProperties;

	public void requestUserLogin(HttpServletResponse res) throws IOException {
		userOauthService.requestLogin(res);
	}

	public void requestAdminLogin(HttpServletResponse res) throws IOException {
		adminOauthService.requestLogin(res);
	}

	public void handleUserLogin(HttpServletRequest req, HttpServletResponse res, String code) throws IOException, ExecutionException, InterruptedException {
		FtProfile profile = userOauthService.getProfileByCode(code);
		User user = userQueryService.findUser(profile.getIntraName())
				.orElseGet(() -> userCommandService.createUserByFtProfile(profile));
		String token = tokenProvider.createUserToken(user, LocalDateTime.now());
		Cookie cookie = authCookieManager.cookieOf(TokenProvider.USER_TOKEN_NAME, token);
		authCookieManager.setCookieToClient(res, cookie, "/", req.getServerName());
		res.sendRedirect(domainProperties.getFeHost() + "/home");
	}

	public void handleAdminLogin(HttpServletRequest req, HttpServletResponse res, String code) throws IOException, ExecutionException, InterruptedException {
		GoogleProfile profile = adminOauthService.getProfileByCode(code);
		Admin admin = adminQueryService.findByEmail(profile.getEmail())
				.orElseGet(() -> adminCommandService.createAdminByEmail(profile.getEmail()));
		String token = tokenProvider.createAdminToken(admin, LocalDateTime.now());
		Cookie cookie = authCookieManager.cookieOf(TokenProvider.ADMIN_TOKEN_NAME, token);
		authCookieManager.setCookieToClient(res, cookie, "/", req.getServerName());
		res.sendRedirect(domainProperties.getFeHost() + "/admin/home");
	}

	public void masterLogin(MasterLoginDto masterLoginDto, HttpServletRequest req,
	                        HttpServletResponse res, LocalDateTime now) {
		// TODO : 서비스로 빼기
		if (!masterLoginDto.getId().equals(masterProperties.getId())
				|| !masterLoginDto.getPassword().equals(masterProperties.getPassword()))
			throw new ServiceException(ExceptionStatus.UNAUTHORIZED_ADMIN);
		String masterToken = tokenProvider.createMasterToken(now);
		Cookie cookie = authCookieManager.cookieOf(TokenProvider.ADMIN_TOKEN_NAME, masterToken);
		authCookieManager.setCookieToClient(res, cookie, "/", req.getServerName());
	}

	public void userLogout(HttpServletResponse res) {
		Cookie userCookie = authCookieManager.cookieOf(TokenProvider.USER_TOKEN_NAME, "");
		authCookieManager.setCookieToClient(res, userCookie, "/", res.getHeader("host"));
	}

	public void adminLogout(HttpServletResponse res) {
		Cookie adminCookie = authCookieManager.cookieOf(TokenProvider.ADMIN_TOKEN_NAME, "");
		authCookieManager.setCookieToClient(res, adminCookie, "/", res.getHeader("host"));
	}
}
