package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.scribejava.core.model.OAuth2AccessToken;
import com.github.scribejava.core.model.OAuthRequest;
import com.github.scribejava.core.model.Response;
import com.github.scribejava.core.model.Verb;
import com.github.scribejava.core.oauth.OAuth20Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.FtProfile;
import org.ftclub.cabinet.auth.domain.OauthConfig;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
@Log4j2
public class FtOauthService {

	@Qualifier(OauthConfig.FT_OAUTH_20_SERVICE)
	private final OAuth20Service ftOAuth20Service;
	private final ObjectMapper objectMapper;

	/**
	 * 42 API 로그인 콜백으로 받은 authorization_code로 유저 프로필 정보를 가져오고, 반환합니다.
	 *
	 * @param code 42 API 로그인 콜백 시 발급받은 authorization_code
	 * @return 유저 프로필 정보 {@link FtProfile}
	 * @throws IOException          HTTP 통신에서 일어나는 입출력 예외
	 * @throws ExecutionException   비동기 처리시 스레드에서 발생한 오류 처리 예외
	 * @throws InterruptedException 비동기 처리시 스레드 종료를 위한 예외
	 * @see <a href="https://stackoverflow.com/questions/2665569/in-what-cases-does-future-get-throw-executionexception-or-interruptedexception">위 예외에 대한 정보</a>
	 */
	public FtProfile getProfileByCode(String code) throws IOException, ExecutionException, InterruptedException {
		OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, ftOAuth20Service.getAuthorizationUrl());
		OAuth2AccessToken accessToken = ftOAuth20Service.getAccessToken(code);
		ftOAuth20Service.signRequest(accessToken, oAuthRequest);
		try {
			Response response = ftOAuth20Service.execute(oAuthRequest);
			return convertJsonStringToProfile(response.getBody());
		} catch (Exception e) {
			if (e instanceof IOException)
				log.error("42 API 서버에서 프로필 정보를 가져오는데 실패했습니다."
						+ "code: {}, message: {}", code, e.getMessage());
			if (e instanceof ExecutionException || e instanceof InterruptedException)
				log.error("42 API 서버에서 프로필 정보를 비동기적으로 가져오는데 실패했습니다."
						+ "code: {}, message: {}", code, e.getMessage());
			throw new ServiceException(ExceptionStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * String 형태의 JSON 데이터를 {@link FtProfile}로 변환합니다.
	 *
	 * @param jsonString String 형태의 JSON 데이터
	 * @return 유저 프로필 정보 {@link FtProfile}
	 * @throws JsonProcessingException JSON 파싱 예외
	 * @see <a href="https://api.intra.42.fr/apidoc/2.0/users/me.html">42 API에서 제공하는 Profile Json에 대한 정보</a>
	 */
	private FtProfile convertJsonStringToProfile(String jsonString) throws JsonProcessingException {
		JsonNode rootNode = objectMapper.readTree(jsonString);
		String intraName = rootNode.get("login").asText();
		String email = rootNode.get("email").asText();
		if (intraName == null || email == null)
			throw new ServiceException(ExceptionStatus.INCORRECT_ARGUMENT);

		LocalDateTime blackHoledAt = DateUtil.convertStringToDate(rootNode
				.get("cursus_users")
				.get(1).get("blackholed_at").asText());

		return FtProfile.builder()
				.intraName(intraName)
				.email(email)
				.blackHoledAt(blackHoledAt)
				.build();
	}
}
