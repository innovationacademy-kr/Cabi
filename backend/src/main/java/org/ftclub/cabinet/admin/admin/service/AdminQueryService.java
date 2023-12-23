package org.ftclub.cabinet.admin.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminQueryService {
	private final AdminRepository adminRepository;

	public Optional<Admin> findByEmail(String email) {
		return adminRepository.findByEmail(email);
	}
}
