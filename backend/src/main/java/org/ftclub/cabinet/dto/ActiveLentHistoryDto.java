package org.ftclub.cabinet.dto;

import javax.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class ActiveLentHistoryDto {

	private final Long userId;
	private final String name;
	private final String email;
	private final Long cabinetId;
	private final Boolean isExpired;
	@Nullable
	private final Long daysFromExpireDate;
}
