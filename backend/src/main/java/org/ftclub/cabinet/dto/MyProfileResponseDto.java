package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.user.domain.LentExtension;

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
	private final String date = LocalDateTime.now().format(
			DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss 'KST'", Locale.US)
	);
	private final LentExtensionResponseDto lentExtensionResponseDto;
}
