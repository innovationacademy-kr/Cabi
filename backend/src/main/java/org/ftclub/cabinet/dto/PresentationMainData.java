package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.Data;

@Data
public class PresentationMainData {

	private final List<PresentationFormData> past;
	private final List<PresentationFormData> upcoming;
}
