package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 유저의 식별자, 이름, 이메일을 반환하는 DTO입니다.
 */
@AllArgsConstructor
@Getter
public class UserDto {

	private final Long userId;
	private final String name;
	private final String email;
}
