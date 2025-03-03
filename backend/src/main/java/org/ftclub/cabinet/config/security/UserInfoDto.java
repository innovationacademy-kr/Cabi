package org.ftclub.cabinet.config.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@ToString
@Getter
public class UserInfoDto {

	private final Long userId;
	private final String oauth;
	private final String roles;

}
