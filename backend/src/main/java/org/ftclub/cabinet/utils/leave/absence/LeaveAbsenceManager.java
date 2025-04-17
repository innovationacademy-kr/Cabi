package org.ftclub.cabinet.utils.leave.absence;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.FtOauthProfile;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.service.OauthProfileService;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
@RequiredArgsConstructor
@Log4j2
public class LeaveAbsenceManager {

	private final LentFacadeService lentFacadeService;
	private final UserCommandService userCommandService;
	private final OauthProfileService oauthProfileService;

	public void handleLeaveAbsence(Long userId, String name) {
		log.info("called handleLeaveAbsence {} {}", userId, name);
		try {
			FtOauthProfile ftProfile = oauthProfileService.getProfileByIntraName(name);
			if (ftProfile.hasRole((FtRole.INACTIVE))) {
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
