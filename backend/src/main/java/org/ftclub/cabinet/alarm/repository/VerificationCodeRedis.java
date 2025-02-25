package org.ftclub.cabinet.alarm.repository;

import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)

public class VerificationCodeRedis {

	private static final String VERIFICATION_CODE_SUFFIX = ":verificationCode";
	private final RedisTemplate<String, String> verificationCodeTemplate;


	public void saveVerificationCode(String name, String code) {
		verificationCodeTemplate.opsForValue()
				.set(name + VERIFICATION_CODE_SUFFIX,
						code,
						Duration.ofMinutes(3)
				);
	}

	public String getVerificationCode(String name) {
		return verificationCodeTemplate.opsForValue().get(name);
	}

	public void deleteVerificationCode(String name, String code) {
		verificationCodeTemplate.opsForValue().getAndDelete(name + VERIFICATION_CODE_SUFFIX);
	}
}
