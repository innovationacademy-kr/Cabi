package org.ftclub.cabinet.config.security;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

/**
 * google -> uid, email
 * <p>
 * ft -> intraId, email, blackholedAt, role
 * <p>
 * userRole
 */
@Getter
@AllArgsConstructor
public class CustomOauth2User implements OAuth2User {

	private String provider;
	private String userId;
	private Map<String, Object> attributes;

	@Override
	public Map<String, Object> getAttributes() {
		return attributes;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of();
	}

	@Override
	public String getName() {
		return provider;
	}

	public String getEmail() {
		return (String) attributes.get("email");
	}

}
