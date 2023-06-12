package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * UserProfileDto의 페이지네이션입니다.
 */
@AllArgsConstructor
@Getter
public class UserProfilePaginationDto {

	private final List<UserProfileDto> result;
	private final Long totalPage;
}
