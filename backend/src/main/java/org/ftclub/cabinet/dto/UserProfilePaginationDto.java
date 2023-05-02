package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserProfilePaginationDto {

    private final List<UserProfileDto> result;
    private final Integer totalLength;
}
