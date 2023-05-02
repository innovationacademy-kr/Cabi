package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class BlockedUserPaginationDto {

    private final List<BlockedUserDto> result;
    private final Integer totalLength;
}
