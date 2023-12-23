package org.ftclub.cabinet.admin.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.admin.admin.repository.AdminRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminCommandService {

	private final AdminRepository adminRepository;

	public Admin createAdminByEmail(String email) {
		log.info("Called createAdminByEmail: {}", email);
		adminRepository.findByEmail(email).ifPresent(admin -> {
			throw new ServiceException(ExceptionStatus.ADMIN_ALREADY_EXISTED);
		});
		return adminRepository.save(Admin.of(email, AdminRole.NONE));
	}

	public void changeAdminRole(Admin admin, AdminRole adminRole) {
		admin.changeAdminRole(adminRole);
		adminRepository.save(admin);
	}
}
