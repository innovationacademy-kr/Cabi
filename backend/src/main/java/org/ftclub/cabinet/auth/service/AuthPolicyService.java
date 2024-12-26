package org.ftclub.cabinet.auth.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.MasterProperties;
import org.springframework.stereotype.Service;

/**
 * 인증 정책을 관리하는 서비스
 */
@Service
@RequiredArgsConstructor
public class AuthPolicyService {
	private final MasterProperties masterProperties;
	private final DomainProperties domainProperties;

	/**
	 * 마스터 계정 정보와 일치하는지 확인
	 *
	 * @param id       아이디
	 * @param password 비밀번호
	 * @return 일치 여부
	 */
	public boolean isMatchWithMasterAuthInfo(String id, String password) {
		return masterProperties.getId().equals(id)
				&& masterProperties.getPassword().equals(password);
	}

	public String getMasterEmail() {
		return masterProperties.getEmail();
	}

	public String getMainHomeUrl() {
		return domainProperties.getFeHost() + "/home";
	}

	public String getAdminHomeUrl() {
		return domainProperties.getFeHost() + "/admin/home";
	}
}
