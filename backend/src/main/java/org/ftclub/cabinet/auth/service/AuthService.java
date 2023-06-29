package org.ftclub.cabinet.auth.service;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.TokenProvider;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.config.MasterProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.service.UserService;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Service;

/**
 * Cabi 자체의 인증 서비스입니다.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

	private final MasterProperties masterProperties;
	private final DomainProperties domainProperties;
	private final JwtProperties jwtProperties;
	private final UserService userService;
	private final TokenProvider tokenProvider;

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
			UserRole role = UserRole.valueOf(claims.get("role").toString());
			Object blackHoledAt = claims.get("blackholedAt");
			if (blackHoledAt == null) {
				userService.createUser(name, email, null, role);
			} else {
				userService.createUser(name, email, DateUtil.stringToDate(blackHoledAt.toString()),
						role);
			}
		}
	}

}
