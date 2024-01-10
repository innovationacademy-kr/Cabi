package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.user.domain.User;

import java.time.LocalDateTime;

/**
 * 유저의 식별자, 이름, 이메일, 블랙홀 날짜를 반환하는 DTO입니다.
 */
@AllArgsConstructor
@Getter
@ToString
public class UserBlackHoleEvent {

	private final Long userId;
	private final String name;
	private final String email;
	private final LocalDateTime blackHoledAt;

	public static UserBlackHoleEvent of(Long userId, String name, String email,
	                                    LocalDateTime blackHoledAt) {
		return new UserBlackHoleEvent(userId, name, email, blackHoledAt);
	}

	public static UserBlackHoleEvent of(User user) {
		return new UserBlackHoleEvent(user.getId(), user.getName(), user.getEmail(), user.getBlackholedAt());
	}
}
