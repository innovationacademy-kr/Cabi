package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ClubInfoPaginationDto {

	private final List<ClubInfoDto> result; //클럽 정보
	private final Long totalLength; //총 개수
}
