package org.ftclub.cabinet.presentation.dto;

import java.time.LocalDateTime;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class PresentationCommentResponseDto {

	@NotNull
	private final Long commentId;
	@NotNull
	private final String user;
	@NotNull
	private final String detail;
	@NotNull
	private final LocalDateTime dateTime;
	private final boolean mine;
	private final boolean banned;
	private final boolean updated;
}
