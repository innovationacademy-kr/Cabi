package org.ftclub.cabinet.utils.leave.absence;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.service.FtApiManager;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.service.LentService;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
@RequiredArgsConstructor
@Log4j2
public class LeaveAbsenceManager {

	private final FtApiManager ftAPIManager;
	private final LentService lentService;
	private final UserService userService;

	private Boolean isLeaveAbsence(JsonNode jsonUserInfo) {
		return !jsonUserInfo.get("active?").asBoolean();
	}

	public void handleLeaveAbsence(Long userId, String name) {
		log.debug("called handleLeaveAbsence {} {}", userId, name);
		try {
			JsonNode jsonUserInfo = ftAPIManager.getFtUsersInfoByName(name);
			if (isLeaveAbsence(jsonUserInfo)) {
				lentService.terminateLentCabinet(userId);
			}
		} catch (HttpClientErrorException e) {
			log.error("handleLeaveAbsence HttpClientErrorException {}", e.getStatusCode());
			if (e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
				lentService.terminateLentCabinet(userId);
				userService.deleteUser(userId, LocalDateTime.now());
			}
		} catch (Exception e) {
			log.error("handleLeaveAbsence Exception: {}, {}", userId, name, e);
		}
	}
}
