package org.ftclub.cabinet.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * 서버 내에서 외부 API를 사용하기 위한 토큰을 정적으로 관리하는 클래스입니다.
 */
@Log4j2
@Component
@RequiredArgsConstructor
public class ApplicationTokenManager {
	private static final int MAX_RETRY = 3;
	private static String FT_ACCESS_TOKEN;
	private final UserOauthService userOauthService;

	/**
	 * 서버가 시작될 때, 42 OAuth 액세스 토큰을 발급합니다.
	 */
	@PostConstruct
	private void init() {
		this.refreshFtAccessToken();
	}

	public String getFtAccessToken() {
		return FT_ACCESS_TOKEN;
	}

	/**
	 * 42 OAuth 액세스 토큰을 새로 발급합니다.
	 * 최대 3번까지 재시도합니다.
	 */
	public void refreshFtAccessToken() {
		int tryCount = 0;
		while (++tryCount <= MAX_RETRY) {
			try {
				FT_ACCESS_TOKEN = userOauthService.issueAccessTokenByCredentialsGrant().getAccessToken();
				break;
			} catch (Exception e) {
				log.error("42 OAuth 액세스 토큰을 발급하는 데에 실패했습니다. 현재 시도 횟수 : {}, {}", tryCount, e.getMessage());
			}
		}
		if (tryCount == MAX_RETRY) {
			log.error("42 OAuth 액세스 토큰을 발급하는 데에 실패했습니다. OAuth 서버가 응답하지 않습니다.");
			throw ExceptionStatus.OAUTH_BAD_GATEWAY.asServiceException();
		}
	}
}
