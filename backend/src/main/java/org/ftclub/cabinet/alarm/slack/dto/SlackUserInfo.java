package org.ftclub.cabinet.alarm.slack.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SlackUserInfo {

	// 접근 지정자가 없습니다.
	String id;
	String name;
	// 얘는 뭔가요?
	@JsonAlias("real_name")
	String realName;
	@JsonAlias("team_id")
	String teamId;
	Boolean deleted;
}

