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
import org.ftclub.cabinet.alarm.repository.AguCodeRedis;
import org.ftclub.cabinet.alarm.service.AguCodeRedisService;
import org.ftclub.cabinet.auth.domain.CookieInfo;
import org.ftclub.cabinet.auth.domain.FtOauthProfile;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.dto.AguMailResponse;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.service.JwtRedisService;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.oauth.service.OauthProfileService;
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

	private static final String VERIFICATION_API = "/v5/auth/agu";
	private final AguCodeRedisService aguCodeRedisService;
	private final UserQueryService userQueryService;
	private final AuthPolicyService authPolicyService;
	private final JwtRedisService jwtRedisService;
	private final JwtService jwtService;
	private final ApplicationTokenManager applicationTokenManager;
	private final ApplicationEventPublisher eventPublisher;
	private final LentQueryService lentQueryService;
	private final OauthProfileService oauthProfileService;
	private final CookieService cookieService;

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
		cookieService.setTokenCookies(res, tokens, req.getServerName());

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
			jwtRedisService.addUsedUserTokensToBlackList(userId, accessToken, refreshToken);
		}
		// 내부 모든 쿠키 삭제
		cookieService.deleteAllCookies(request.getCookies(), request.getServerName(), response);
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

		Cookie cookie = new Cookie(JwtTokenConstants.AGU_TOKEN, temporaryToken);
		CookieInfo cookieInfo = new CookieInfo(req.getServerName(), 60 * 60, true);

		cookieService.setToClient(cookie, cookieInfo, res);
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
	public AguMailResponse requestTemporaryLogin(String name) throws JsonProcessingException {
		User user = userQueryService.getUserByName(name);
		FtOauthProfile profile = oauthProfileService.getProfileByIntraName(
				applicationTokenManager.getFtAccessToken(), name);

		if (!user.isContainRole(FtRole.AGU.name()) && !profile.isSameRole(FtRole.AGU)) {
			throw ExceptionStatus.ACCESS_DENIED.asServiceException();
		}
		lentQueryService.getUserActiveLentHistory(user.getId())
				.orElseThrow(ExceptionStatus.NO_ACTIVE_LENT_FOUND::asServiceException);

		// 코드가 있는데 발급 요청이면 에러(3분 내로 재요청)
		if (aguCodeRedisService.isAlreadyExist(name)) {
			throw ExceptionStatus.CODE_ALREADY_SENT.asServiceException();
		}

		String aguCode = aguCodeRedisService.createAguCode(user.getName());

		String verificationLink = generateVerificationLink(aguCode, name);
		AlarmEvent alarmEvent =
				AlarmEvent.of(user.getId(), new EmailVerificationAlarm(verificationLink));
		eventPublisher.publishEvent(alarmEvent);
		return new AguMailResponse(user.getEmail(), AguCodeRedis.EXPIRY_MIN);
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
}
