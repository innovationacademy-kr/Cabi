package org.ftclub.cabinet.dto;

import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;

@AllArgsConstructor
@ToString
@Getter
public class UserInfoDto {

	private final Long userId;
	private final String oauth;
	private final String roles;
	private final String email;

	public static UserInfoDto fromClaims(Claims claims) {
		Long userId = claims.get(JwtTokenConstants.USER_ID, Long.class);
		String provider = claims.get(JwtTokenConstants.OAUTH, String.class);
		String roles = claims.get(JwtTokenConstants.ROLES, String.class);
		String email = claims.get(JwtTokenConstants.EMAIL, String.class);

		if (userId == null || provider == null || roles == null || email == null) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return new UserInfoDto(userId, provider, roles, email);
	}

	public boolean hasRole(String otherRole) {
		return this.roles.contains(otherRole);
	}

	public boolean isAdmin() {
		return this.roles.contains(AdminRole.ADMIN.name())
				|| this.roles.contains(AdminRole.MASTER.name());
	}
}
