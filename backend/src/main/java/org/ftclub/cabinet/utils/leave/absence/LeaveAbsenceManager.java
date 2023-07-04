package org.ftclub.cabinet.utils.leave.absence;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.service.FtApiManager;
import org.ftclub.cabinet.lent.service.LentService;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
@RequiredArgsConstructor
public class LeaveAbsenceManager {

	private final FtApiManager ftAPIManager;
	private final LentService lentService;
	private final UserService userService;

	private Boolean isLeaveAbsence(JsonNode jsonUserInfo) {
		return !jsonUserInfo.get("active?").asBoolean();
	}

	public void handleLeaveAbsence(Long userId, String name) {
		try {
			JsonNode jsonUserInfo = ftAPIManager.getFtUserInfo(name);
			if (isLeaveAbsence(jsonUserInfo)) {
				lentService.terminateLentCabinet(userId);
			}
		} catch (HttpClientErrorException e) {
			e.printStackTrace();
			if (e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
				lentService.terminateLentCabinet(userId);
				userService.deleteUser(userId, LocalDateTime.now());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
