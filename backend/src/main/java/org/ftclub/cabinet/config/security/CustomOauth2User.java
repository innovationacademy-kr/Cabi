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
 * provider: oauth 로그인 경로
 * <p>
 * userId: oauth에서 발급한 고유 Id
 * <p>
 * attribute: oauth별로 사용한 정보들
 */
@Getter
@RequiredArgsConstructor
public class CustomOauth2User implements OAuth2User {

	private final String provider;
	private final String name;
	private final Map<String, Object> attributes;


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
		FtRole role = (FtRole) attributes.get("role");

		return List.of(role::getAuthority);
	}

	@Override
	public String getName() {
		return name;
	}

	public String getEmail() {
		return (String) attributes.getOrDefault("email", "unknown");
	}

	public LocalDateTime getBlackHoledAt() {
		return (LocalDateTime) attributes.getOrDefault("blackholedAt", "unknown");
	}

	public FtRole getRole() {
		return (FtRole) attributes.getOrDefault("role", "unknown");
	}

}
