package org.ftclub.cabinet.admin.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminFacadeService {
	private final AdminQueryService adminQueryService;
	private final AdminCommandService adminCommandService;

	public void promoteAdminByEmail(String email) {
		log.debug("Called promoteUserToAdmin: {}", email);
		Admin admin = adminQueryService.findByEmail(email)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_ADMIN));
		adminCommandService.changeAdminRole(admin, AdminRole.ADMIN);
	}
}
