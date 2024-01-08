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
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.domain.scribejava.OauthConfig;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserOauthService {
	private static final int CURSUS_INDEX = 1;

	@Qualifier(OauthConfig.FT_OAUTH_20_SERVICE)
	private final OAuth20Service ftOAuth20Service;
	private final FtApiProperties ftApiProperties;
	private final ObjectMapper objectMapper;

	public void requestLogin(HttpServletResponse res) throws IOException {
		String url = ftOAuth20Service.getAuthorizationUrl();
		res.sendRedirect(url);
	}

	public OAuth2AccessToken issueAccessTokenByCredentialsGrant() throws IOException, ExecutionException, InterruptedException {
		return ftOAuth20Service.getAccessTokenClientCredentialsGrant();
	}

	public FtProfile getProfileByIntraName(String accessToken, String intraName) throws JsonProcessingException {
		log.info("Called getProfileByIntraName {}", intraName);
		JsonNode result = WebClient.create().get()
				.uri(ftApiProperties.getUsersInfoUri() + '/' + intraName)
				.accept(MediaType.APPLICATION_JSON)
				.headers(h -> h.setBearerAuth(accessToken))
				.retrieve()
				.bodyToMono(JsonNode.class)
				.block();
		return convertJsonStringToProfile(result);
	}

	/**
	 * 42 API 로그인 콜백으로 받은 authorization_code로 유저 프로필 정보를 가져오고, 반환합니다.
	 *
	 * @param code 42 API 로그인 콜백 시 발급받은 authorization_code
	 * @return 유저 프로필 정보 {@link FtProfile}
	 * @throws IOException          HTTP 통신에서 일어나는 입출력 예외
	 * @throws ExecutionException   비동기 처리시 스레드에서 발생한 오류 처리 예외
	 * @throws InterruptedException 비동기 처리시 스레드 종료를 위한 예외
	 */
	public FtProfile getProfileByCode(String code) throws IOException, ExecutionException, InterruptedException {
		OAuth2AccessToken accessToken = ftOAuth20Service.getAccessToken(code);
		OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, ftApiProperties.getUserInfoUri());
		ftOAuth20Service.signRequest(accessToken, oAuthRequest);
		try {
			Response response = ftOAuth20Service.execute(oAuthRequest);
			return convertJsonStringToProfile(objectMapper.readTree(response.getBody()));
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
	 * @param jsonNode JSON 데이터
	 * @return 유저 프로필 정보 {@link FtProfile}
	 * @throws JsonProcessingException JSON 파싱 예외
	 * @see <a href="https://api.intra.42.fr/apidoc/2.0/users/me.html">42 API에서 제공하는 Profile Json에 대한 정보</a>
	 */
	private FtProfile convertJsonStringToProfile(JsonNode jsonNode) throws JsonProcessingException {
		String intraName = jsonNode.get("login").asText();
		String email = jsonNode.get("email").asText();
		if (intraName == null || email == null)
			throw new ServiceException(ExceptionStatus.INCORRECT_ARGUMENT);

		LocalDateTime blackHoledAt = determineBlackHoledAt(jsonNode);
		FtRole role = determineFtRole(jsonNode, blackHoledAt);

		return FtProfile.builder()
				.intraName(intraName)
				.email(email)
				.role(role)
				.blackHoledAt(blackHoledAt)
				.build();
	}

	private FtRole determineFtRole(JsonNode rootNode, LocalDateTime blackHoledAt) {
		boolean isUserStaff = rootNode.get("staff?").asBoolean();
		boolean isActive = rootNode.get("active?").asBoolean();
		JsonNode cursusUsersNode = rootNode.get("cursus_users");

		if (!isActive)
			return FtRole.INACTIVE;

		if (isUserStaff)
			return FtRole.STAFF;

		if (cursusUsersNode.size() < CURSUS_INDEX + 1)
			return FtRole.PISCINER;

		return (blackHoledAt == null) ? FtRole.MEMBER : FtRole.CADET;
	}

	private LocalDateTime determineBlackHoledAt(JsonNode rootNode) {
		JsonNode blackHoledAtNode = rootNode.get("cursus_users").get(CURSUS_INDEX).get("blackholed_at");
		if (blackHoledAtNode.isNull() || blackHoledAtNode.isEmpty())
			return null;
		return DateUtil.convertStringToDate(blackHoledAtNode.asText());
	}
}