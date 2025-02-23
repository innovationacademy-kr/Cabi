package org.ftclub.cabinet.config.security;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@ToString
@Getter
public class UserInfoDto {

	private final Long userId;
	private final String oauth;
	private final String roles;

}
