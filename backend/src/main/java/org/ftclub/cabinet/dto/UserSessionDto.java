package org.ftclub.cabinet.dto;

import java.util.Date;
import lombok.Getter;

/**
 * 유저의 정보와 로그인 세션 정보를 갖는 DTO입니다.
 */
@Getter
public class UserSessionDto extends UserDto {

	private final Integer tokenIssuedAt;
	private final Integer tokenExpiresAt;
	private final Date blackHoledAt;
	private final Boolean isStaff;

	public UserSessionDto(Long userId, String name, String email,
			Integer tokenIssuedAt, Integer tokenExpiresAt, Date blackHoledAt, Boolean isStaff) {
		super(userId, name, email);
		this.tokenIssuedAt = tokenIssuedAt;
		this.tokenExpiresAt = tokenExpiresAt;
		this.blackHoledAt = blackHoledAt;
		this.isStaff = isStaff;
	}

}
