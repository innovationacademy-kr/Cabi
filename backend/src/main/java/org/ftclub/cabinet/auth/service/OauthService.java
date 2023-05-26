package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.ApiRequestManager;
import org.ftclub.cabinet.config.ApiProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * OAuth를 수행하는 서비스 클래스입니다.
 */
@Service
@RequiredArgsConstructor
public class OauthService {

	private final ObjectMapper objectMapper;

	/**
	 * 구글 OAuth 인증을 위한 URL을 생성하고, HttpServletResponse에 리다이렉트합니다.
	 *
	 * @param response {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	public void sendToApi(HttpServletResponse response, ApiProperties apiProperties)
			throws IOException {
		response.sendRedirect(
				ApiRequestManager.of(apiProperties)
						.getCodeRequestUri());
	}

	/**
	 * 구글 OAuth 인증을 위한 토큰을 요청합니다.
	 *
	 * @param code 인증 코드
	 * @return API 액세스 토큰
	 * @throws ServiceException API 요청에 에러가 반환됐을 때 발생하는 예외
	 */
	public String getTokenByCode(String code, ApiProperties apiProperties) {
		return WebClient.create().post()
				.uri(apiProperties.getTokenUri())
				.body(BodyInserters.fromFormData(
						ApiRequestManager.of(apiProperties)
								.getAccessTokenRequestBodyMap(code)))
				.retrieve()
				.bodyToMono(String.class)
				.map(response -> {
					try {
						return objectMapper.readTree(response)
								.get(apiProperties.getAccessTokenName()).asText();
					} catch (JsonProcessingException e) {
						throw new RuntimeException(e);
					}
				})
				.onErrorResume(e -> {
					throw new ServiceException(ExceptionStatus.OAUTH_BAD_GATEWAY);
				})
				.block();
	}


	/**
	 * 구글 OAuth 인증을 통해 받은 토큰을 이용해 사용자 정보를 요청합니다.
	 *
	 * @param token 토큰
	 * @return 사용자 정보
	 * @throws ServiceException API 요청에 에러가 반환됐을 때 발생하는 예외
	 */
	public JsonNode getProfileByToken(String token, ApiProperties apiProperties) {
		return WebClient.create().get()
				.uri(apiProperties.getUserInfoUri())
				.headers(headers -> headers.setBearerAuth(token))
				.retrieve()
				.bodyToMono(String.class)
				.map(response -> {
					try {
						return objectMapper.readTree(response);
					} catch (JsonProcessingException e) {
						throw new RuntimeException(e);
					}
				})
				.onErrorResume(e -> {
					throw new ServiceException(ExceptionStatus.OAUTH_BAD_GATEWAY);
				})
				.block();
	}
}
