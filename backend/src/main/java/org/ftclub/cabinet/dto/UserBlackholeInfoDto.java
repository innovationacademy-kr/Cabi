package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * 유저의 식별자, 이름, 이메일, 블랙홀 날짜를 반환하는 DTO입니다.
 */
@AllArgsConstructor
@Getter
@ToString
public class UserBlackholeInfoDto {

	private final Long userId;
	private final String name;
	private final String email;
	private final LocalDateTime blackHoledAt;

	public static UserBlackholeInfoDto of(Long userId, String name, String email,
			LocalDateTime blackHoledAt) {
		return new UserBlackholeInfoDto(userId, name, email, blackHoledAt);
	}
}
