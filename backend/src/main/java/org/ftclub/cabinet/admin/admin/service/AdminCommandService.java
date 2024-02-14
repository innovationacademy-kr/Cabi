package org.ftclub.cabinet.admin.admin.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.admin.admin.repository.AdminRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

/**
 * 관리자(Admin)과 관련한 CUD를 제공하는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class AdminCommandService {

	private final AdminRepository adminRepository;

	/**
	 * 관리자를 생성합니다.
	 *
	 * @param email 관리자 이메일
	 * @return {@link Admin}
	 */
	public Admin createAdminByEmail(String email) {
		adminRepository.findByEmail(email).ifPresent(admin -> {
			throw ExceptionStatus.ADMIN_ALREADY_EXISTED.asServiceException();
		});
		return adminRepository.save(Admin.of(email, AdminRole.NONE));
	}
}
