package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class CoinHistoryPaginationDto {

	private List<CoinHistoryDto> result;
	private Long totalLength;
}
