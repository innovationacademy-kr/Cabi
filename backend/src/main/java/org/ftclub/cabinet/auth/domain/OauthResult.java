package org.ftclub.cabinet.auth.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class OauthResult {

	private Long userId;
	private String roles;
	private String redirectionUrl;
	private String email;

	// user -> email 포함 안함
	public OauthResult(Long userId, String roles, String redirectionUrl) {
		this(userId, roles, redirectionUrl, null);
	}

	public boolean hasRole(String role) {
		return role != null && role.contains(roles);
	}

	public boolean isAdmin() {
		return this.hasRole("ADMIN") || this.hasRole("MASTER");
	}

	public String getRedirectionUrl() {
		return this.redirectionUrl + "?status=200";
	}
}
