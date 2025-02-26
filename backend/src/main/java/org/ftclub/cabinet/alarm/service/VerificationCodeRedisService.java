package org.ftclub.cabinet.alarm.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.repository.VerificationCodeRedis;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerificationCodeRedisService {

	private final VerificationCodeRedis codeRedis;

	public void verifyTemporaryCode(String name, String code) {
		String codeInRedis = codeRedis.getVerificationCode(name);

		if (codeInRedis == null || !codeInRedis.equals(code)) {
			throw ExceptionStatus.NOT_FOUND_VERIFICATION_CODE.asServiceException();
		}
	}

	public void createOauthCodeLink(Long userId, String code) {
		codeRedis.saveOauthLinkCode(String.valueOf(userId), code);
	}

	public void createVerificationCode(String name, String code) {
		codeRedis.saveVerificationCode(name, code);
	}

	public void deleteVerificationCode(String name, String code) {
		codeRedis.deleteVerificationCode(name, code);
	}

	public Long getUserIdByLinkCode(String linkCode) {
		String userId = codeRedis.getUserIdByOauthLink(linkCode);
		if (userId == null) {
			throw ExceptionStatus.NOT_FOUND_OAUTH_LINK.asServiceException();
		}
		return Long.parseLong(userId);
	}

	public void removeOauthLink(String code) {
		codeRedis.deleteOauthLink(code);
	}
}
