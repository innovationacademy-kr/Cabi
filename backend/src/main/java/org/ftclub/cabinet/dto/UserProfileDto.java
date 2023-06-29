package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 유저의 식별자와 이름을 반환하는 DTO입니다.
 */
@AllArgsConstructor
@Getter
public class UserProfileDto {

	private final Long userId;
	private final String name;
}
