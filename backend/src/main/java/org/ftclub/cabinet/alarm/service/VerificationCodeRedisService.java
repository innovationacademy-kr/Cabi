package org.ftclub.cabinet.alarm.service;

import javax.transaction.Transactional;
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

	@Transactional
	public void saveVerificationCode(String name, String code) {
		codeRedis.saveVerificationCode(name, code);
	}

	public void deleteVerificationCode(String name, String code) {
		codeRedis.deleteVerificationCode(name, code);
	}

}
