package org.ftclub.cabinet.auth.domain;

import java.time.LocalDateTime;
import java.util.Set;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class FtOauthProfile {

	private final String intraName;
	private final String email;
	private final LocalDateTime blackHoledAt;
	private final Set<FtRole> roles;

	public boolean hasRole(FtRole role) {
		return this.roles.contains(role);
	}
}
