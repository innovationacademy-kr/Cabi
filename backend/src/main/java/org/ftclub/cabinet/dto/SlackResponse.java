package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SlackResponse {
	private String ok;
	@JsonAlias("user")
	private SlackUserInfo slackUserInfo;
}
