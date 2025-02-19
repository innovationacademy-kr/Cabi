package org.ftclub.cabinet.config.security;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@RequiredArgsConstructor
@ToString
@Getter
public class UserInfoDto {

	private final Long userId;
	private final String roles;
}
