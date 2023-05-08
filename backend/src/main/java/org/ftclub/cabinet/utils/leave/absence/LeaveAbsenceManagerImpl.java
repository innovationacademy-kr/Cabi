package org.ftclub.cabinet.utils.leave.absence;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.utils.FtAPIService;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LeaveAbsenceManagerImpl implements LeaveAbsenceManager {

    private final FtAPIService ftAPIService;
    private final LentFacadeService lentFacadeService;

    @Override
    public Boolean checkLeaveAbsence(String name) {
        JSONObject jsonUserInfo = this.ftAPIService.getFtUserInfo(name);
        if (jsonUserInfo == null) {
            return false;
        }
        return jsonUserInfo.getBoolean("active?");
    }

    @Override
    public void handleLeaveAbsence(LentHistoryDto lent) {
        if (this.checkLeaveAbsence(lent.getName())) {
            this.lentFacadeService.endLentCabinet(lent.getUserId());
        }
    }
}
