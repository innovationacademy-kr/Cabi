package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.PresentationTime;

@AllArgsConstructor
@Getter
@ToString
public class PresentationFormRequestDto {

	private final Category category;
	private final LocalDateTime dateTime;
	private final PresentationTime presentationTime;
	private final String subject;
	private final String summary;
	private final String detail;
	private final String userName;
}
