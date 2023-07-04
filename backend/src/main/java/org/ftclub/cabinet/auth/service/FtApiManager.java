package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.ApiRequestManager;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * 42API를 사용하기 위한 클래스
 * TODO: 추후 Spring Security를 적용하면 삭제 예정
 */
@Component
@RequiredArgsConstructor
public class FtApiManager {

	private final FtApiProperties ftApiProperties;
	private String accessToken;
	private final ObjectMapper objectMapper;

	/**
	 * 42 토큰을 발급받는다.
	 */
	public void issueAccessToken() {
		String accessToken =
				WebClient.create().post()
						.uri(ftApiProperties.getTokenUri())
						.body(BodyInserters.fromFormData(
								ApiRequestManager.of(ftApiProperties)
										.getAccessTokenRequestBodyMapWithClientSecret()))
						.retrieve()
						.bodyToMono(String.class)
						.map(response -> {
							try {
								return objectMapper.readTree(response)
										.get(ftApiProperties.getAccessTokenName()).asText();
							} catch (Exception e) {
								throw new RuntimeException();
							}
						})
						.onErrorResume(e -> {
							throw new ServiceException(ExceptionStatus.OAUTH_BAD_GATEWAY);
						})
						.block();
		this.accessToken = accessToken;
	}

	/**
	 * 42API를 통해 특정 유저의 정보를 가져온다.
	 *
	 * @param name 유저의 이름
	 * @return JsonNode 형태의 유저 정보
	 */
	public JsonNode getFtUserInfo(String name) {
		var ref = new Object() {
			Integer tryCount = 0;
		};
		while (ref.tryCount < 3) {
			JsonNode result = WebClient.create().get()
					.uri(ftApiProperties.getUsersInfoUri() + '/' + name)
					.headers(headers -> headers.setBearerAuth(accessToken))
					.retrieve()
					.bodyToMono(String.class)
					.map(response -> {
						try {
							return objectMapper.readTree(response);
						} catch (JsonProcessingException e) {
							e.printStackTrace();
							this.issueAccessToken();
							ref.tryCount++;
							if (ref.tryCount == 3) {
								throw new RuntimeException(e);
							}
						}
						return null;
					})
					.onErrorResume(e -> {
						throw new ServiceException(ExceptionStatus.OAUTH_BAD_GATEWAY);
					})
					.block();
			if (result != null) {
				return result;
			}
		}
		return null;
	}
}
