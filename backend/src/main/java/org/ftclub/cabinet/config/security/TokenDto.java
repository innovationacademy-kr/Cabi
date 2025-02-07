package org.ftclub.cabinet.config.security;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class TokenDto {

	private final String accessToken;
	private final String refreshToken;
}
