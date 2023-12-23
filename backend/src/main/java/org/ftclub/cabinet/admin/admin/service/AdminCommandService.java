package org.ftclub.cabinet.admin.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.admin.admin.repository.AdminRepository;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminCommandService {

	private final AdminRepository adminRepository;

	public Admin createAdminByEmail(String email) {
		return adminRepository.save(Admin.of(email, AdminRole.NONE));
	}

}
