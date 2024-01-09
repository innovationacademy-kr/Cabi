package org.ftclub.cabinet.auth.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.MasterProperties;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthPolicyService {
	private final MasterProperties masterProperties;
	private final DomainProperties domainProperties;

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
