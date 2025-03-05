package org.ftclub.cabinet.admin.admin.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.repository.AdminRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

/**
 * 관리자(Admin)와 관련한 쿼리 로직을 처리하는 서비스 클래스입니다.
 */
@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class AdminQueryService {

	private final AdminRepository adminRepository;

	public Optional<Admin> findByEmail(String email) {
		return adminRepository.findByEmail(email);
	}

	public Admin getById(Long userId) {

		return adminRepository.findById(userId)
				.orElseThrow(ExceptionStatus.NOT_FOUND_USER::asServiceException);
	}
}
