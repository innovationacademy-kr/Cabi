package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserOauthConnectionDto {

	private final String email;
	private final String providerType;
}
