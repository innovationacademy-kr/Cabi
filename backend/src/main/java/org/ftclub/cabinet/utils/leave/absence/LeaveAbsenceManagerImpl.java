package org.ftclub.cabinet.utils.leave.absence;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.lent.service.LentService;
import org.ftclub.cabinet.user.service.UserService;
import org.ftclub.cabinet.utils.FtAPIManager;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
@RequiredArgsConstructor
public class LeaveAbsenceManagerImpl implements LeaveAbsenceManager {

    private final FtAPIManager ftAPIManager;
    private final LentService lentService;
    private final UserService userService;

    @Override
    public Boolean isLeaveAbsence(JsonNode jsonUserInfo) {
        return !jsonUserInfo.get("active?").asBoolean();
    }

    @Override
    public void handleLeaveAbsence(Long userId, String name) {
        try {
            JsonNode jsonUserInfo = this.ftAPIManager.getFtUserInfo(name);
            if (isLeaveAbsence(jsonUserInfo)) {
                this.lentService.terminateLentCabinet(userId);
            }
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
            if (e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
                this.lentService.terminateLentCabinet(userId);
                this.userService.deleteUser(userId);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
