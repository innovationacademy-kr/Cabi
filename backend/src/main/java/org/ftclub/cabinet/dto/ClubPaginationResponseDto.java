package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class ClubPaginationResponseDto {

	private final List<ClubResponseDto> result;
	private final Long totalLength;
}
