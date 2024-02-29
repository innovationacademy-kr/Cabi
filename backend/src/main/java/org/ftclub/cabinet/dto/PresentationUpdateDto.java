package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class PresentationUpdateDto {

	@NotEmpty
	private final LocalDateTime dateTime;
	@NotEmpty
	private final String status;
	@NotEmpty
	private final String location;
}
