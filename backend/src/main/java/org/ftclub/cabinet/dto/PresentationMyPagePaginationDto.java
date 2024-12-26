package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.Data;

@Data
public class PresentationMyPagePaginationDto {

	private final List<PresentationMyPageDto> result;
	private final Long totalLength;
}
