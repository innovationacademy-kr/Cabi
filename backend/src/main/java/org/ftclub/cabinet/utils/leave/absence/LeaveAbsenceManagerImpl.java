package org.ftclub.cabinet.utils.leave.absence;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.lent.service.LentService;
import org.ftclub.cabinet.utils.FtAPIManager;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LeaveAbsenceManagerImpl implements LeaveAbsenceManager {

    private final FtAPIManager ftAPIManager;
    private final LentService lentService;

    @Override
    public Boolean isLeaveAbsence(String name) {
        JSONObject jsonUserInfo = this.ftAPIManager.getFtUserInfo(name);
        if (jsonUserInfo == null) {
            return true;
        }
        return !jsonUserInfo.getBoolean("active?");
    }

    @Override
    public void handleLeaveAbsence(Long userId, String name) {
        if (this.isLeaveAbsence(name)) {
            this.lentService.terminateLentCabinet(userId);
        }
    }
}
