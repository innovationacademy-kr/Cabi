package org.ftclub.cabinet.dto;

import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;

@Getter
public class BrokenCabinetDto extends CabinetDto {

    private final String statusNote;

    public BrokenCabinetDto(Long cabinetId, Integer visibleNum, LentType lentType, Integer maxUser,
            String title, CabinetStatus status, Location location, String statusNote) {
        super(cabinetId, visibleNum, lentType, maxUser, title, status, location);
        this.statusNote = statusNote;
    }
}
