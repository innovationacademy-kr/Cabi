package org.ftclub.cabinet.dto;

import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;

@AllArgsConstructor
@ToString
@Getter
public class UserInfoDto {

	private final Long userId;
	private final String oauth;
	private final String roles;

	public static UserInfoDto fromClaims(Claims claims) {
		Long userId = claims.get(JwtTokenConstants.USER_ID, Long.class);
		String provider = claims.get(JwtTokenConstants.OAUTH, String.class);
		String roles = claims.get(JwtTokenConstants.ROLES, String.class);

		if (userId == null || provider == null || roles == null) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return new UserInfoDto(userId, provider, roles);
	}
}
