package org.ftclub.cabinet.dto;

import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StateInfoDto {

	private Long userId;
	private String mode;
	private String originalState;
	private String context;


	public static StateInfoDto fromClaim(Claims claims) {
		Long userId = claims.get("userId", Long.class);
		String mode = claims.get("mode", String.class);
		String originalState = claims.get("originalState", String.class);
		String context = claims.get("context", String.class);

		return new StateInfoDto(userId, mode, originalState, context);
	}

	public boolean isConnectionMode() {
		return "connect".equals(mode);
	}

	public boolean isAdminContext() {
		return "admin".equals(context);
	}
}
