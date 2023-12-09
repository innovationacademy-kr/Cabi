package org.ftclub.cabinet.alarm.slack.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;

@Log4j2
@Getter
@AllArgsConstructor
public class SlackResponse {

	private final String ok;

	@JsonAlias("user")
	private final SlackUserInfo slackUserInfo;

	private static final String CONFIG_ERROR = "false";

	private static final String AUTH_ERROR = "error";

	/**
	 * config 에러 혹은 키 관련 에러일 경우에도 200 ok 를 줍니다.
	 * ok 의 값을 확인해야 에러인지 확인할 수 있습니다.
	 */
	public void responseCheck(){
		log.error("Slack Response ERROR Error {} ", this.toString());

		if (ok.equals(CONFIG_ERROR)) {
			throw new ServiceException(ExceptionStatus.SLACK_REQUEST_BAD_GATEWAY);
		}
		if (ok.equals(AUTH_ERROR)) {
			throw new ServiceException(ExceptionStatus.SLACK_ID_NOT_FOUND);
		}
	}

	public boolean hasError() {
		return ok.equals(CONFIG_ERROR) || ok.equals(AUTH_ERROR);
	}
}

