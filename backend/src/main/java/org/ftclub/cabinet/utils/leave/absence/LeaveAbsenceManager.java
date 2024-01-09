package org.ftclub.cabinet.utils.leave.absence;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.FtProfile;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.service.ApplicationTokenManager;
import org.ftclub.cabinet.auth.service.UserOauthService;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Log4j2
public class LeaveAbsenceManager {

	private final UserOauthService userOauthService;
	private final ApplicationTokenManager tokenManager;
	private final LentFacadeService lentFacadeService;
	private final UserCommandService userCommandService;

	public void handleLeaveAbsence(Long userId, String name) {
		log.info("called handleLeaveAbsence {} {}", userId, name);
		try {
			FtProfile ftProfile = userOauthService.getProfileByIntraName(tokenManager.getFtAccessToken(), name);
			if (ftProfile.getRole().equals(FtRole.INACTIVE)) {
				lentFacadeService.endUserLent(userId, null);
			}
		} catch (HttpClientErrorException e) {
			log.error("handleLeaveAbsence HttpClientErrorException {}", e.getStatusCode());
			if (e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
				lentFacadeService.endUserLent(userId, null);
				userCommandService.deleteById(userId, LocalDateTime.now());
			}
		} catch (Exception e) {
			log.error("handleLeaveAbsence Exception: {}, {}", userId, name, e);
		}
	}
}
