package org.ftclub.cabinet.auth.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.MasterProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

import static org.ftclub.cabinet.user.domain.UserRole.USER;

/**
 * Cabi 자체의 인증 서비스입니다.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

	private final MasterProperties masterProperties;
	private final DomainProperties domainProperties;
	private final UserService userService;

	public boolean validateMasterLogin(MasterLoginDto masterLoginDto) {
		return masterLoginDto.getId().equals(masterProperties.getId())
				&& masterLoginDto.getPassword().equals(masterProperties.getPassword());
	}

	public void addUserIfNotExistsByClaims(Map<String, Object> claims) {

		String email = claims.get("email").toString();
		if (email == null) {
			throw new ServiceException(ExceptionStatus.INVALID_ARGUMENT);
		}
		if (userService.checkUserExists(email) || userService.checkAdminUserExists(email)) {
			return;
		}
		if (email.endsWith(domainProperties.getAdminEmailDomain())) {
			userService.createAdminUser(email);
		}
		if (email.endsWith(domainProperties.getUserEmailDomain())) {
			String name = claims.get("name").toString();
			LocalDateTime blackHoledAt = (LocalDateTime) claims.get("blackholedAt");
			if (blackHoledAt == null) {
				userService.createUser(name, email, null, USER);
			} else {
				userService.createUser(name, email, blackHoledAt, USER);
			}
		}
	}

}
