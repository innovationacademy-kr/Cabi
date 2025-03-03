package org.ftclub.cabinet.auth.domain;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class FtOauthProfile {

	private final String intraName;
	private final String email;
	private final LocalDateTime blackHoledAt;
	private final List<FtRole> roles;
}
