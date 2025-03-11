package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.EmailVerificationAlarm;
import org.ftclub.cabinet.alarm.service.AguCodeRedisService;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.auth.domain.UserOauthConnection;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.dto.UserOauthMailDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.service.JwtRedisService;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * 토큰 관리, 인증 정보 관리, 인가 부여
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {

	private static final String VERIFICATION_API = "/v4/auth/AGU";
	private final UserOauthConnectionCommandService userOauthConnectionCommandService;
	private final AguCodeRedisService aguCodeRedisService;
	private final CookieManager cookieManager;
	private final UserQueryService userQueryService;
	private final AuthPolicyService authPolicyService;
	private final JwtRedisService jwtRedisService;
	private final OauthService oauthService;
	private final JwtService jwtService;
	private final ApplicationTokenManager applicationTokenManager;
	private final ApplicationEventPublisher eventPublisher;
	private final UserOauthConnectionQueryService userOauthConnectionQueryService;

	@Value("${cabinet.server.be-host}")
	private String beHost;

	/**
	 * 토큰을 생성해 cookie에 저장하고, securityContextHolder에 정보를 저장합니다.
	 *
	 * @param req      HttpServletRequest
	 * @param res      HttpServletResponse
	 * @param result   oauthLogin 파싱 결과
	 * @param provider oauthLogin 타입
	 */
	public void processAuthentication(HttpServletRequest req, HttpServletResponse res,
			OauthResult result, String provider) {

		TokenDto tokens = jwtService.createTokens(result.getUserId(), result.getRoles(), provider);
		cookieManager.setTokenCookies(res, tokens, req.getServerName());

		Authentication auth = createAuthenticationForUser(result, provider);
		SecurityContextHolder.getContext().setAuthentication(auth);
	}


	/**
	 * SecurityContextHolder에 저장할 유저 정보
	 *
	 * @param user
	 * @param provider
	 * @return
	 */
	public Authentication createAuthenticationForUser(OauthResult user, String provider) {

		UserInfoDto userInfoDto =
				new UserInfoDto(user.getUserId(), provider, user.getRoles());

		List<GrantedAuthority> authorityList = Stream.of(user.getRoles().split(FtRole.DELIMITER))
				.map(role -> new SimpleGrantedAuthority(FtRole.ROLE + role))
				.collect(Collectors.toList());

		return new UsernamePasswordAuthenticationToken(userInfoDto, null, authorityList);
	}


	/**
	 * 토큰들을 블랙리스트에 추가하고, 쿠키를 제거합니다.
	 *
	 * @param request
	 * @param response
	 * @param userId
	 * @param refreshToken
	 */
	public void userLogout(
			HttpServletRequest request,
			HttpServletResponse response,
			Long userId,
			String refreshToken) throws IOException {

		String accessToken = jwtService.extractToken(request);
		if (accessToken != null && refreshToken != null) {
			jwtRedisService.addUserUsedTokens(userId, accessToken, refreshToken);
		}
		// 내부 모든 쿠키 삭제
		cookieManager.deleteAllCookies(request.getCookies(), response);
	}

	public void adminLogout(
			HttpServletRequest request,
			HttpServletResponse response,
			Long userId,
			String refreshToken) throws IOException {

		// TODO: admin 토큰 폐기도 처리해야함 accessToken, refreshToken 사용 처리
		String accessToken = jwtService.extractToken(request);
		if (accessToken != null && refreshToken != null) {
			jwtRedisService.addUsedAdminTokens(userId, accessToken, refreshToken);
		}
		// 내부 모든 쿠키 삭제
		cookieManager.deleteAllCookies(request.getCookies(), response);
	}

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
	 * redis 내의 코드와 비교하여 검증합니다.
	 * <p>
	 * 성공 시 임시토큰을 쿠키에 설정하고, AGU 페이지로 리다이렉트합니다.
	 *
	 * @param name
	 * @param code
	 * @return
	 */
	public void verifyTemporaryCode(HttpServletRequest req,
			HttpServletResponse res,
			String name,
			String code) throws IOException {

		User user = userQueryService.getUserByName(name);
		aguCodeRedisService.verifyTemporaryCode(name, code);

		aguCodeRedisService.removeAguCode(name);
		String temporaryToken =
				jwtService.createAguToken(user.getId());

		Cookie cookie = new Cookie(JwtTokenConstants.ACCESS_TOKEN, temporaryToken);
		cookie.setSecure(true);
		cookie.setHttpOnly(true);
		cookie.setMaxAge(60 * 60 * 100);
		cookieManager.setToClient(res, cookie, "/", req.getServerName());

		res.sendRedirect(authPolicyService.getAGUUrl());
	}

	/**
	 * 이름으로 유저를 검색합니다
	 * <p>
	 * AGU 유저라면 code를 만들어 redis에 저장하고, 메일을 발송합니다.
	 *
	 * @param name
	 * @return
	 * @throws JsonProcessingException
	 */
	public UserOauthMailDto requestTemporaryLogin(String name) throws JsonProcessingException {
		User user = userQueryService.getUserByName(name);
		// agu 상태인지 검증 이 유저가 지금 당장 최신의 profile에 AGU라고 박혀잇니??
		if (!user.getRoles().contains(FtRole.AGU.name())
				&& !oauthService.isAguUser(name, applicationTokenManager.getFtAccessToken())) {
			throw ExceptionStatus.ACCESS_DENIED.asServiceException();
		}
		// 코드가 있는데 발급 요청이면 에러(3분 내로 재요청)
		if (aguCodeRedisService.isAlreadyExist(name)) {
			throw ExceptionStatus.CODE_ALREADY_SENT.asServiceException();
		}

		String aguCode = aguCodeRedisService.createAguCode(user.getName());

		String verificationLink = generateVerificationLink(aguCode, name);
		AlarmEvent alarmEvent =
				AlarmEvent.of(user.getId(), new EmailVerificationAlarm(verificationLink));
		eventPublisher.publishEvent(alarmEvent);
		return new UserOauthMailDto(user.getEmail());
	}

	private String generateVerificationLink(String aguCode, String name) {
		return UriComponentsBuilder.fromHttpUrl(beHost)
				.path(VERIFICATION_API)
				.queryParam("code", aguCode)
				.queryParam("name", name)
				.encode(StandardCharsets.UTF_8)
				.build()
				.toUriString();
	}

	/**
	 * 계정 연동을 해지합니다.
	 *
	 * @param userId
	 */
	public void deleteOauthMail(Long userId, String oauthMail, String provider) {

		UserOauthConnection connection = userOauthConnectionQueryService.findByUserId(userId)
				.orElseThrow(ExceptionStatus.NOT_FOUND_OAUTH_LINK::asServiceException);

		if (!connection.getProviderType().equals(provider)
				|| connection.getEmail().equals(oauthMail)) {
			throw ExceptionStatus.NOT_FOUND_OAUTH_LINK.asServiceException();
		}
		userOauthConnectionCommandService.deleteByUserId(userId);
	}
}
