package org.ftclub.cabinet.auth.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class OauthResult {

	private Long userId;
	private String roles;
	private String redirectionUrl;

}
