package org.ftclub.cabinet.dto;

import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;

@Getter
public class CabinetWithMemoDto extends CabinetDto {
    private final String memo;
    public CabinetWithMemoDto(
        Long cabinetId,
        Integer visibleNum,
        LentType lentType,
        Integer maxUser,
        String title,
        CabinetStatus status,
        Location location,
        String memo) {
            super(cabinetId, visibleNum, lentType, maxUser, title, status, location);
            this.memo = memo;
    }
}