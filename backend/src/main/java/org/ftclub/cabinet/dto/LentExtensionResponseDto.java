package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.user.domain.LentExtensionType;

@Getter
@AllArgsConstructor
@ToString
@Builder
public class LentExtensionResponseDto {

	private long lentExtensionId;
	private String name;
	private int extensionPeriod;
	// 추후에 프론트랑 의논 후 expiredAt의 타입을 다시 LocalDateTime으로 변경해야 함
	private String expiredAt;
	private LentExtensionType lentExtensionType;
}
