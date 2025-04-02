package org.ftclub.cabinet.oauth.domain;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

@Getter
@RequiredArgsConstructor
public class CustomOAuth2User implements OAuth2User {

	private final Oauth2Attributes oauth2Attributes;
	private String name;
	private String provider;
	private String email;

	public String getEmail() {
		return oauth2Attributes.getEmail();
	}

	public String getProvider() {
		return oauth2Attributes.getProvider();
	}

	@Override
	public String getName() {
		return oauth2Attributes.getName();
	}

	@Override
	public Map<String, Object> getAttributes() {
		return oauth2Attributes.getAttributes();
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of();
	}
}
