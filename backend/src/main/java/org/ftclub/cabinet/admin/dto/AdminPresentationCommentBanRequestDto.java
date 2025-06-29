package org.ftclub.cabinet.admin.dto;

import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AdminPresentationCommentBanRequestDto {

	@NotNull(message = "banned 값은 null일 수 없습니다.")
	private boolean banned;
}
