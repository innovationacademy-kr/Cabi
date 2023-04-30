package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.Location;

import java.util.Date;

@AllArgsConstructor
@Getter
public class LentHistoryDto {
    private final Long userId;
    private final String name;
    private final Long cabinetId;
    private final Integer visibleNum;
    @JsonUnwrapped
    private final Location location;
    private final Date startedAt;
    private final Date endedAt;
}
