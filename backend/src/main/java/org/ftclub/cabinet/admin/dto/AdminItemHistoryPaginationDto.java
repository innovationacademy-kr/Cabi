package org.ftclub.cabinet.admin.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminItemHistoryPaginationDto {

	private List<AdminItemHistoryDto> itemHistories;
	private Long totalLength;
}
