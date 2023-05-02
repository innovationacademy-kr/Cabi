package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;

@Getter
public class MyCabinetInfoResponseDto extends CabinetWithMemoDto {

    private final List<LentDto> lents;

    public MyCabinetInfoResponseDto(Long cabinetId, Integer visibleNum, LentType lentType,
            Integer maxUser, String title, CabinetStatus status, Location location, String memo,
            List<LentDto> lents) {
        super(cabinetId, visibleNum, lentType, maxUser, title, status, location, memo);
        this.lents = lents;
    }
}
