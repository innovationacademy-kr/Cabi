package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class BlockedUserPaginationDto {
    private final List<BlockedUserDto> result;
    private final Integer totalLength;
}
