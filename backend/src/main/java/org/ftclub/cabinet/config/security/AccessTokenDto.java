package org.ftclub.cabinet.config.security;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@Builder
public class AccessTokenDto {

	private final String accessToken;
}
