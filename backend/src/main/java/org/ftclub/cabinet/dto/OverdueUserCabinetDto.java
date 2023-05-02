package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.Location;

@AllArgsConstructor
@Getter
public class OverdueUserCabinetDto {

    private final String name;
    private final Long cabinetId;
    @JsonUnwrapped
    private final Location location; // 기존의 DB에 있는 location과 다른 값으로 사용중. 현재 양식에 맞춰서 프론트 변경 필요.
    private final Integer overdueDays;
}
