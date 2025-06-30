package org.ftclub.cabinet.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminPresentationCommentBanResponseDto {

	private final String detail;
	private final boolean banned;
}
