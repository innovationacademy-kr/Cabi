package org.ftclub.cabinet.config.security;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.FtRole;
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
@RequiredArgsConstructor
public class CustomOauth2User implements OAuth2User {

	private final String provider;
	private final String userId;
	private final Map<String, Object> attributes;
	private String email;
	private FtRole role;
	private LocalDateTime blackHoledAt;


	public static CustomOauth2User fromFtOauth(String provider, String userId,
			Map<String, Object> attribute, FtRole role,
			LocalDateTime blackHoledAt) {
		CustomOauth2User user = new CustomOauth2User(provider, userId, attribute);
		user.role = role;
		user.blackHoledAt = blackHoledAt;
		user.email = (String) attribute.get("email");

		return user;
	}

	@Override
	public Map<String, Object> getAttributes() {
		return attributes;
	}

	/**
	 * security 내부에서 인가를 검증하기 위해 사용합니다.
	 *
	 * @return
	 */
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(() -> role.getAuthority());
	}

	@Override
	public String getName() {
		return provider;
	}

}
