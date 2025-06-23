package org.ftclub.cabinet.admin.dto;

import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminPresentationCommentBanRequestDto {

	@NotNull(message = "banned 값은 null일 수 없습니다.")
	private boolean banned;
}
