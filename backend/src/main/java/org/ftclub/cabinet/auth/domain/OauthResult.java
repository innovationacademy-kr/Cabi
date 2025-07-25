package org.ftclub.cabinet.auth.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class OauthResult {

	private Long userId;
	private String roles;
	private String email;
	private String redirectionUrl;

	public boolean hasRole(String role) {
		return role != null && role.contains(roles);
	}

	public String getRedirectionUrl() {
		return this.redirectionUrl + "?status=200";
	}
}
