package org.ftclub.cabinet.admin.admin.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

/**
 * 관리자(Admin)와 관련한 비즈니스 로직을 처리하는 서비스 클래스입니다.
 */
@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class AdminFacadeService {

	private final AdminQueryService adminQueryService;
	private final AdminCommandService adminCommandService;

	/**
	 * 관리자({@link AdminRole#ADMIN})로 해당 Admin의 권한을 변경합니다.
	 *
	 * @param email 유저의 이메일
	 */
	public void promoteAdminByEmail(String email) {
		Admin admin = adminQueryService.findByEmail(email)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_ADMIN));
		adminCommandService.changeAdminRole(admin, AdminRole.ADMIN);
	}
}
