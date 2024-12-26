package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.scribejava.core.model.OAuth2AccessToken;
import com.github.scribejava.core.model.OAuthRequest;
import com.github.scribejava.core.model.Response;
import com.github.scribejava.core.model.Verb;
import com.github.scribejava.core.oauth.OAuth20Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.GoogleProfile;
import org.ftclub.cabinet.auth.domain.scribejava.OauthConfig;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.ExecutionException;

@Service
@Log4j2
@RequiredArgsConstructor
public class AdminOauthService {

	@Qualifier(OauthConfig.GOOGLE_OAUTH_20_SERVICE)
	private final OAuth20Service googleOAuth20Service;
	private final ObjectMapper objectMapper;

	/**
	 * 구글 로그인 페이지로 리다이렉트합니다.
	 *
	 * @param res 요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	public void requestLogin(HttpServletResponse res) throws IOException {
		res.sendRedirect(googleOAuth20Service.getAuthorizationUrl());
	}

	/**
	 * 42 API 로그인 콜백으로 받은 authorization_code로 유저 프로필 정보를 가져오고, 반환합니다.
	 *
	 * @param code 42 API 로그인 콜백 시 발급받은 authorization_code
	 * @return 유저 프로필 정보 {@link GoogleProfile}
	 * @throws IOException          HTTP 통신에서 일어나는 입출력 예외
	 * @throws ExecutionException   비동기 처리시 스레드에서 발생한 오류 처리 예외
	 * @throws InterruptedException 비동기 처리시 스레드 종료를 위한 예외
	 */
	public GoogleProfile getProfileByCode(String code)
			throws IOException, ExecutionException, InterruptedException {
		OAuth2AccessToken accessToken = googleOAuth20Service.getAccessToken(code);
		OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET,
				"https://www.googleapis.com/oauth2/v2/userinfo");
		googleOAuth20Service.signRequest(accessToken, oAuthRequest);
		try {
			Response response = googleOAuth20Service.execute(oAuthRequest);
			return convertJsonStringToProfile(response.getBody());
		} catch (Exception e) {
			if (e instanceof IOException) {
				log.error("42 API 서버에서 프로필 정보를 가져오는데 실패했습니다."
						+ "code: {}, message: {}", code, e.getMessage());
			}
			if (e instanceof ExecutionException || e instanceof InterruptedException) {
				log.error("42 API 서버에서 프로필 정보를 비동기적으로 가져오는데 실패했습니다."
						+ "code: {}, message: {}", code, e.getMessage());
			}
			throw ExceptionStatus.INTERNAL_SERVER_ERROR.asServiceException();
		}
	}

	/**
	 * 42 API 서버에서 받은 JSON 문자열을 {@link GoogleProfile}로 변환합니다.
	 *
	 * @param jsonString
	 * @return
	 * @throws IOException
	 * @see <a
	 * href="https://developers.google.com/identity/protocols/oauth2/openid-connect#obtainuserinfo">참고</a>
	 */
	private GoogleProfile convertJsonStringToProfile(String jsonString) throws IOException {
		JsonNode jsonNode = objectMapper.readTree(jsonString);
		return GoogleProfile.builder()
				.email(jsonNode.get("email").asText())
				.build();
	}
}
