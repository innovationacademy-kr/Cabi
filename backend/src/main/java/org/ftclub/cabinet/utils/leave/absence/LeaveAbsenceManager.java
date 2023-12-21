package org.ftclub.cabinet.utils.leave.absence;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.service.FtApiManager;
import org.ftclub.cabinet.lent.newService.LentFacadeService;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
@RequiredArgsConstructor
@Log4j2
public class LeaveAbsenceManager {

    private final FtApiManager ftAPIManager;
    private final LentFacadeService lentFacadeService;
    private final UserService userService;

    private Boolean isLeaveAbsence(JsonNode jsonUserInfo) {
        return !jsonUserInfo.get("active?").asBoolean();
    }

    public void handleLeaveAbsence(Long userId, String name) {
        log.info("called handleLeaveAbsence {} {}", userId, name);
        try {
            JsonNode jsonUserInfo = ftAPIManager.getFtUsersInfoByName(name);
            if (isLeaveAbsence(jsonUserInfo)) {
                lentFacadeService.endUserLent(userId);
            }
        } catch (HttpClientErrorException e) {
            log.error("handleLeaveAbsence HttpClientErrorException {}", e.getStatusCode());
            if (e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
                lentFacadeService.endUserLent(userId);
                userService.deleteUser(userId, LocalDateTime.now());
            }
        } catch (Exception e) {
            log.error("handleLeaveAbsence Exception: {}, {}", userId, name, e);
        }
    }
}
