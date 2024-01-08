package org.ftclub.cabinet.admin.admin.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class AdminFacadeService {

	private final AdminQueryService adminQueryService;
	private final AdminCommandService adminCommandService;

	public void promoteAdminByEmail(String email) {
		Admin admin = adminQueryService.findByEmail(email)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_ADMIN));
		adminCommandService.changeAdminRole(admin, AdminRole.ADMIN);
	}
}
