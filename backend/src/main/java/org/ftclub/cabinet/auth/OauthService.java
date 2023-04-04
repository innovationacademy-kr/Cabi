package org.ftclub.cabinet.auth;

import org.springframework.stereotype.Service;

@Service
public class OauthService {

	public void sendToApi(String providerName) {
		System.out.printf("%s\n", providerName);
	}

	public AdminProfileDto getProfile(String providerName, String code) {
		System.out.printf("%s\n", providerName);
		System.out.printf("%s\n", code);
		AdminProfileDto ret = new AdminProfileDto(code);
		return (ret);
	}
}
