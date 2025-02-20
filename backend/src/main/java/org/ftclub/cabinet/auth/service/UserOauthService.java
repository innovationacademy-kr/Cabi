package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.scribejava.core.model.OAuth2AccessToken;
import com.github.scribejava.core.model.OAuthRequest;
import com.github.scribejava.core.model.Response;
import com.github.scribejava.core.model.Verb;
import com.github.scribejava.core.oauth.OAuth20Service;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.concurrent.ExecutionException;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.FtProfile;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.domain.scribejava.OauthConfig;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * 유저 로그인을 위한 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class UserOauthService {

	private static final int CURSUS_INDEX = 1;
	private static final int PISCINE_INDEX = 0;
	private static final int CADET_INDEX = 1;

	@Qualifier(OauthConfig.FT_OAUTH_20_SERVICE)
	private final OAuth20Service ftOAuth20Service;
	private final FtApiProperties ftApiProperties;
	private final ObjectMapper objectMapper;

	/**
	 * 42 API 로그인 페이지로 리다이렉트합니다.
	 *
	 * @param res 요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	public void requestLogin(HttpServletResponse res) throws IOException {
		String url = ftOAuth20Service.getAuthorizationUrl();
		res.sendRedirect(url);
	}

	/**
	 * ScribeJava를 이용해 42 API에 authorization_code를 전달하여 access_token을 발급받습니다.
	 *
	 * @return 발급받은 access_token
	 * @throws IOException
	 * @throws ExecutionException
	 * @throws InterruptedException
	 */
	public OAuth2AccessToken issueAccessTokenByCredentialsGrant()
			throws IOException, ExecutionException, InterruptedException {
		return ftOAuth20Service.getAccessTokenClientCredentialsGrant();
	}

	/**
	 * 42 API에 access_token을 전달하여 유저 프로필 정보를 가져오고, {@link FtProfile}로 반환합니다.
	 *
	 * @param accessToken 42 API에 전달할 access_token
	 * @return 유저 프로필 정보 {@link FtProfile}
	 * @throws JsonProcessingException JSON 파싱 예외
	 */
	public FtProfile getProfileByIntraName(String accessToken, String intraName)
			throws JsonProcessingException {
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
	public FtProfile getProfileByCode(String code)
			throws IOException, ExecutionException, InterruptedException {
		OAuth2AccessToken accessToken = ftOAuth20Service.getAccessToken(code);
		OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, ftApiProperties.getUserInfoUri());
		ftOAuth20Service.signRequest(accessToken, oAuthRequest);
		try {
			Response response = ftOAuth20Service.execute(oAuthRequest);
			return convertJsonStringToProfile(objectMapper.readTree(response.getBody()));
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
	 * String 형태의 JSON 데이터를 {@link FtProfile}로 변환합니다.
	 *
	 * @param jsonNode JSON 데이터
	 * @return 유저 프로필 정보 {@link FtProfile}
	 * @throws JsonProcessingException JSON 파싱 예외
	 * @see <a href="https://api.intra.42.fr/apidoc/2.0/users/me.html">42 API에서 제공하는 Profile Json에
	 * 대한 정보</a>
	 */
	private FtProfile convertJsonStringToProfile(JsonNode jsonNode) throws JsonProcessingException {
		String intraName = jsonNode.get("login").asText();
		String email = jsonNode.get("email").asText();
		if (intraName == null || email == null) {
			throw ExceptionStatus.INCORRECT_ARGUMENT.asServiceException();
		}

		LocalDateTime blackHoledAt = determineBlackHoledAt(jsonNode);
		FtRole role = determineFtRole(jsonNode, blackHoledAt);

		return FtProfile.builder()
				.intraName(intraName)
				.email(email)
				.role(role)
				.blackHoledAt(blackHoledAt)
				.build();
	}

	/**
	 * AccessToken을 이용해 받은 JSON 형식의 유저 profile 정보를 통해 유저의 role을 반환합니다.
	 * <br>
	 * 유저가 staff인지, active인지, pisciner인지, cadet인지, blackholed인지에 따라 role을 결정합니다.
	 *
	 * @param rootNode     유저 프로필 정보 JSON 데이터
	 * @param blackHoledAt 유저가 blackholed된 시각
	 * @return 유저의 role
	 */
	private FtRole determineFtRole(JsonNode rootNode, LocalDateTime blackHoledAt) {
		boolean isUserStaff = rootNode.get("staff?").asBoolean();
		boolean isActive = rootNode.get("active?").asBoolean();
		JsonNode cursusUsersNode = rootNode.get("cursus_users");

		if (!isActive) {
			return FtRole.INACTIVE;
		}

		if (isUserStaff) {
			return FtRole.STAFF;
		}

		if (cursusUsersNode.size() < CURSUS_INDEX + 1) {
			return FtRole.PISCINER;
		}

		return (blackHoledAt == null) ? FtRole.MEMBER : FtRole.CADET;
	}

	/**
	 * AccessToken을 이용해 받은 JSON 형식의 유저 profile 정보를 통해 유저의 blackholedAt을 반환합니다.
	 * <br>
	 * 유저가 blackhole에 빠지는 시각을 반환합니다.
	 * <p>
	 * cursus_user : 유저가 42에서 활동한 과정들 ex) 0 -> 피신, 1 -> 입과 후
	 * <p>
	 * 42 서울과정을 중심으로 생각해, 과정을 더 진행한 유저여도 1번 idx의 blackholed_at 값을 가져옵니다.
	 *
	 * @param rootNode 유저 프로필 정보 JSON 데이터
	 * @return 유저의 blackholedAt
	 */
	private LocalDateTime determineBlackHoledAt(JsonNode rootNode) {
		JsonNode cursusNode = rootNode.get("cursus_users");
		int index = cursusNode.size() > CADET_INDEX ? CADET_INDEX : PISCINE_INDEX;

		JsonNode blackHoledAtNode = cursusNode.get(index).get("blackholed_at");
		if (blackHoledAtNode.isNull() || blackHoledAtNode.asText().isEmpty()) {
			return null;
		}
		return DateUtil.convertStringToDate(blackHoledAtNode.asText());
	}
}
