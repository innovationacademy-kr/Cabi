package org.ftclub.cabinet.security.domain;

import io.jsonwebtoken.Claims;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;

@ToString(callSuper = true)
@Getter
public class AdminInfoDto extends UserInfoDto {

	private final String email;

	public AdminInfoDto(Long userId, String oauth, String roles, String email) {
		super(userId, oauth, roles);
		this.email = email;
	}

	public static AdminInfoDto fromClaims(Claims claims) {
		// 기본 UserInfoDto 정보 추출
		Long userId = claims.get(JwtTokenConstants.USER_ID, Long.class);
		String provider = claims.get(JwtTokenConstants.OAUTH, String.class);
		String roles = claims.get(JwtTokenConstants.ROLES, String.class);

		// 필수 필드 검증
		if (userId == null || provider == null || roles == null) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}

		// 이메일 정보 추출
		String email = claims.get(JwtTokenConstants.EMAIL, String.class);

		return new AdminInfoDto(userId, provider, roles, email);
	}

}
