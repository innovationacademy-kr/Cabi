package org.ftclub.cabinet.alarm.service;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.alarm.repository.AguCodeRedis;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AguCodeRedisService {

	private final AguCodeRedis codeRedis;

	public void verifyTemporaryCode(String name, String code) {
		String codeInRedis = codeRedis.findAguCodeByName(name);

		if (codeInRedis == null || !codeInRedis.equals(code)) {
			throw ExceptionStatus.NOT_FOUND_VERIFICATION_LINK.asServiceException();
		}
	}

	public boolean isAlreadyExist(String name) {
		return codeRedis.findAguCodeByName(name) != null;
	}

	public String createAguCode(String name) {
		String code = UUID.randomUUID().toString();

		codeRedis.saveAguCode(name, code);
		return code;
	}

	public void removeAguCode(String name) {
		codeRedis.deleteCode(name);
	}
}
