package org.ftclub.cabinet.alarm.slack.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class SlackUserInfo {
	private String id;
	private String name;
	@JsonAlias("real_name")
	private String realName;
	@JsonAlias("team_id")
	private String teamId;
	private Boolean deleted;
}

