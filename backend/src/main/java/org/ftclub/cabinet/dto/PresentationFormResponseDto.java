package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.Data;

@Data
public class PresentationFormResponseDto {

	private final List<PresentationFormData> forms;
}
