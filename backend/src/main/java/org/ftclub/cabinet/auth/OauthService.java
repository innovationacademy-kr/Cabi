package org.ftclub.cabinet.auth;

import java.io.IOException;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * OAuth를 수행하는 서비스 클래스입니다.
 */
@Service
@RequiredArgsConstructor
public class OauthService {

	private final ApiUriBuilder apiUriBuilder;

	private final GoogleApiProperties googleApiProperties;

	private final FtApiProperties ftApiProperties;

	/**
	 * 구글 OAuth 인증을 위한 URL을 생성하고, HttpServletResponse에 리다이렉트합니다.
	 *
	 * @param response {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	public void sendToGoogleApi(HttpServletResponse response) throws IOException {
		response.sendRedirect(
				apiUriBuilder.buildCodeUri(
						googleApiProperties.getAuthUri(),
						googleApiProperties.getClientId(),
						googleApiProperties.getRedirectUri(),
						googleApiProperties.getScope(),
						googleApiProperties.getGrantType())
		);
	}

	/**
	 * 구글 OAuth 인증을 위한 토큰을 요청합니다.
	 *
	 * @param code 인증 코드
	 * @return API 액세스 토큰
	 * @throws ServiceException API 요청에 에러가 반환됐을 때 발생하는 예외
	 */
	public String getGoogleToken(String code) {
		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();

		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		map.add("grant_type", "authorization_code");
		map.add("client_id", googleApiProperties.getClientId());
		map.add("client_secret", googleApiProperties.getClientSecret());
		map.add("redirect_uri", googleApiProperties.getRedirectUri());
		map.add("code", code);

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
		try {
			return new JSONObject(
					restTemplate.postForEntity(googleApiProperties.getTokenUri(), request,
							String.class).getBody())
					.get(googleApiProperties.getAccessTokenName())
					.toString();
		} catch (Exception e) {
			throw new ServiceException(ExceptionStatus.OAUTH_BAD_GATEWAY);
		}
	}


	/**
	 * 구글 OAuth 인증을 통해 받은 토큰을 이용해 사용자 정보를 요청합니다.
	 *
	 * @param token 토큰
	 * @return 사용자 정보
	 * @throws ServiceException API 요청에 에러가 반환됐을 때 발생하는 예외
	 */
	public JSONObject getGoogleProfile(String token) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		headers.setBearerAuth(token);

		MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
		HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
		RestTemplate restTemplate = new RestTemplate();
		try {
			return new JSONObject(
					restTemplate.exchange(googleApiProperties.getUserInfoUri(), HttpMethod.GET,
									requestEntity, String.class)
							.getBody());
		} catch (Exception e) {
			throw new ServiceException(ExceptionStatus.OAUTH_BAD_GATEWAY);
		}
	}

	/**
	 * FT OAuth 인증을 위한 URL을 생성하고, HttpServletResponse에 리다이렉트합니다.
	 *
	 * @param response {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	public void sendToFtApi(HttpServletResponse response) throws IOException {
		String dir = apiUriBuilder.buildCodeUri(
				ftApiProperties.getAuthUri(),
				ftApiProperties.getClientId(),
				ftApiProperties.getRedirectUri(),
				ftApiProperties.getScope(),
				ftApiProperties.getGrantType());
		response.sendRedirect(dir);
	}

	/**
	 * FT OAuth 인증을 위한 토큰을 요청합니다.
	 *
	 * @param code 인증 코드
	 * @return API 액세스 토큰
	 * @throws ServiceException API 요청에 에러가 반환됐을 때 발생하는 예외
	 */
	public String getFtToken(String code) {
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();

		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		map.add("grant_type", "authorization_code");
		map.add("client_id", ftApiProperties.getClientId());
		map.add("client_secret", ftApiProperties.getClientSecret());
		map.add("redirect_uri", ftApiProperties.getRedirectUri());
		map.add("code", code);
		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
		try {
			return new JSONObject(
					restTemplate.postForEntity(ftApiProperties.getTokenUri(), request, String.class)
							.getBody())
					.get(ftApiProperties.getAccessTokenName()).toString();
		} catch (Exception e) {
			throw new ServiceException(ExceptionStatus.OAUTH_BAD_GATEWAY);
		}
	}

	/**
	 * FT OAuth 인증을 통해 받은 토큰을 이용해 사용자 정보를 요청합니다.
	 *
	 * @param token 토큰
	 * @return 사용자 정보
	 * @throws ServiceException API 요청에 에러가 반환됐을 때 발생하는 예외
	 */
	public JSONObject getFtProfile(String token) {
		HttpHeaders headers = new HttpHeaders();
		RestTemplate restTemplate = new RestTemplate();

		headers.setBearerAuth(token);
		HttpEntity<String> requestEntity = new HttpEntity<String>("parameters", headers);
		try {
			return new JSONObject(
					restTemplate.exchange(ftApiProperties.getUserInfoUri(), HttpMethod.GET,
									requestEntity, String.class)
							.getBody());
		} catch (Exception e) {
			throw new ServiceException(ExceptionStatus.OAUTH_BAD_GATEWAY);
		}
	}
}
