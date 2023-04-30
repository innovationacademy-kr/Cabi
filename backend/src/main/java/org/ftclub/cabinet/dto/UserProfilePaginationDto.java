package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class UserProfilePaginationDto {
    private final List<UserProfileDto> result;
    private final Integer	totalLength;
}
