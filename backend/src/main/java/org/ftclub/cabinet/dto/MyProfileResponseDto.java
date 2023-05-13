package org.ftclub.cabinet.dto;

import lombok.Getter;

/**
 * 내 프로필 정보와 대여 중인 사물함의 ID를 반환하는 DTO입니다.
 */
@Getter
public class MyProfileResponseDto extends UserProfileDto {

	private final Long cabinetId;

	public MyProfileResponseDto(Long userId, String name, Long cabinetId) {
		super(userId, name);
		this.cabinetId = cabinetId;
	}
}
