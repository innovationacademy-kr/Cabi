package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * BlockedUserPaginationDto의 페이지네이션입니다.
 */
@AllArgsConstructor
@Getter
public class BlockedUserPaginationDto {

	private final List<BlockedUserDto> result;
	private final Long totalPage;
}
