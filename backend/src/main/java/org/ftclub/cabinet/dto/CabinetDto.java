package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.*;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;

@Getter
@AllArgsConstructor
public class CabinetDto {
    private final Long cabinetId;
    private final Integer visibleNum;
    private final LentType lentType;
    private final Integer maxUser;
    private final String title;
    private final CabinetStatus status;
    @JsonUnwrapped
    private final Location location; // 기존의 location, floor, section을 갖는 클래스
}
