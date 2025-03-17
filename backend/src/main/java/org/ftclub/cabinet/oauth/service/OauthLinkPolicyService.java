package org.ftclub.cabinet.oauth.service;

import org.ftclub.cabinet.security.exception.SpringSecurityException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.stereotype.Service;

@Service
public class OauthLinkPolicyService {

	public void verifyOauthSource(String providerType) {
		if (!providerType.equals("ft")) {
			throw new SpringSecurityException(ExceptionStatus.NOT_FT_LOGIN_STATUS);
		}
	}
}
