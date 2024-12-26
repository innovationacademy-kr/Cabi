package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import lombok.Data;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;

/**
 * 날짜, 제목, 상태, 장소
 */
@Data
public class PresentationMyPageDto {

	private final Integer id;
	private final String subject;
	private final LocalDateTime dateTime;
	private final PresentationStatus presentationStatus;
	private final PresentationLocation presentationLocation;
}
