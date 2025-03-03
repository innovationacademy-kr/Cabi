package org.ftclub.cabinet.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@Builder
public class AccessTokenDto {

	private final String accessToken;
}
