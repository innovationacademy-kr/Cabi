package org.ftclub.cabinet.auth.domain;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OauthResult {

	private Long userId;
	private String name;
	private LocalDateTime blackHoledAt;
	private String roles;
	private String email;
	private String redirectionUrl;

}
