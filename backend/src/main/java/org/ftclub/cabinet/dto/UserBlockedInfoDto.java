package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 사용 정지된 유저에 대한 정보입니다.
 */
@AllArgsConstructor
@Getter
public class UserBlockedInfoDto {

	private final Long userId;
	private final String name;
	private final LocalDateTime bannedAt;
	private final LocalDateTime unbannedAt;

	@Override
	public String toString() {
		return "UserBlockedInfoDto [userId=" + userId + ", name=" + name + ", bannedAt=" + bannedAt + ", unbannedAt="
				+ unbannedAt + "]";
	}
}
