package org.ftclub.cabinet.dto;

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
	String id;
	String name;
	@JsonAlias("real_name")
	String realName;
	@JsonAlias("team_id")
	String teamId;
	Boolean deleted;
}
