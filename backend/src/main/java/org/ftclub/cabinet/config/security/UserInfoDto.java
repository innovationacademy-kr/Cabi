package org.ftclub.cabinet.config.security;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class UserInfoDto {

	private final Long userId;
	private final String roles;
}
