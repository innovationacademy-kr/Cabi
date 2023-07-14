package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.ApiRequestManager;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * 42API를 사용하기 위한 클래스
 * TODO: 추후 Spring Security를 적용하면 삭제 예정
 */
@Component
@RequiredArgsConstructor
@Log4j2
public class FtApiManager {

	private final FtApiProperties ftApiProperties;
	private String accessToken;
	private final ObjectMapper objectMapper;
	private static final Integer MAX_RETRY = 3;

	/**
	 * 42 토큰을 발급받는다.
	 */
	public void issueAccessToken() {
		log.info("called issueAccessToken");
		accessToken =
				WebClient.create().post()
						.uri(ftApiProperties.getTokenUri())
						.body(BodyInserters.fromFormData(
								ApiRequestManager.of(ftApiProperties)
										.getAccessTokenRequestBodyMapWithClientSecret(
												"client_credentials")))
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
	}

	/**
	 * 유저의 이름으로 42API를 통해 특정 유저의 정보를 가져온다.
	 *
	 * @param name 유저의 이름
	 * @return JsonNode 형태의 유저 정보
	 */
	public JsonNode getFtUsersInfoByName(String name) {
		log.info("called getFtUsersInfoByName {}", name);
		Integer tryCount = 0;
		while (tryCount < MAX_RETRY) {
			try {
				JsonNode results = WebClient.create().get()
						.uri(ftApiProperties.getUsersInfoUri() + '/' + name)
						.accept(MediaType.APPLICATION_JSON)
						.headers(h -> h.setBearerAuth(accessToken))
						.retrieve()
						.bodyToMono(JsonNode.class)
						.block();
				return results;
			} catch (Exception e) {
				tryCount++;
				log.info(e.getMessage());
				log.info("요청에 실패했습니다. 최대 3번 재시도합니다. 현재 시도 횟수: {}", tryCount);
				this.issueAccessToken();
				if (tryCount == MAX_RETRY) {
					throw new RuntimeException();
				}
			}
		}
		return null;
	}
}
