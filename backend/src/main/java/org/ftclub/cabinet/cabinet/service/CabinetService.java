package org.ftclub.cabinet.cabinet.service;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;

public interface CabinetService {

    Cabinet getCabinet(Long cabinetId);

    void updateStatus(Long cabinetId, CabinetStatus status);

    void updateStatusByUserCount(Long cabinetId, Integer userCount);

    void updateMemo(Long cabinetId, String memo);

    void updateVisibleNum(Long cabinetId, Integer visibleNum);

    void updateTitle(Long cabinetId, String title);

    void updateMaxUser(Long cabinetId, Integer maxUser);

    void updateLentType(Long cabinetId, LentType lentType);

    void updateGrid(Long cabinetId, Grid grid);

    void updateStatusNote(Long cabinetId, String statusNote);
}
