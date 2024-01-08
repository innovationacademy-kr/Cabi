package org.ftclub.cabinet.admin.admin.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.repository.AdminRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class AdminQueryService {

	private final AdminRepository adminRepository;

	public Optional<Admin> findByEmail(String email) {
		return adminRepository.findByEmail(email);
	}
}
