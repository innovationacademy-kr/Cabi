package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserOauthConnectionDto {

	private final String mail;
	private final String providerType;
}
