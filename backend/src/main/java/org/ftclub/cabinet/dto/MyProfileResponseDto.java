package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 내 프로필 정보와 대여 중인 사물함의 ID를 반환하는 DTO입니다.
 */
@AllArgsConstructor
@Getter
public class MyProfileResponseDto {

	private final Long userId;
	private final String name;
	private final Long cabinetId;
	private final LocalDateTime unbannedAt;
}
