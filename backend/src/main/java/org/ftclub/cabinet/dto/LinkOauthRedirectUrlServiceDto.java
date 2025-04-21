package org.ftclub.cabinet.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class LinkOauthRedirectUrlServiceDto {

	private final Long userId;
	private final String provider;
}
