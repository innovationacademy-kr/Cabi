package org.ftclub.cabinet.auth.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.MasterProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.springframework.stereotype.Service;

/**
 * Cabi 자체의 인증 서비스입니다.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

	private final MasterProperties masterProperties;

	public boolean validateMasterLogin(MasterLoginDto masterLoginDto) {
		return masterLoginDto.getId().equals(masterProperties.getId())
				&& masterLoginDto.getPassword().equals(masterProperties.getPassword());
	}
}
