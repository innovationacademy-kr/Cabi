package org.ftclub.cabinet.alarm.repository;

import java.time.Duration;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

@Component
@Logging(level = LogLevel.DEBUG)

public class VerificationCodeRedis {

	private static final String VERIFICATION_CODE_SUFFIX = ":verificationCode";
	private static final String OAUTH_LINK_SUFFIX = ":oauthLinkCode";
	private final ValueOperations<String, String> oauthLinkCodeTemplate;
	private final ValueOperations<String, String> verificationCodeTemplate;

	@Autowired
	public VerificationCodeRedis(
			RedisTemplate<String, String> verificationCodeTemplate,
			RedisTemplate<String, String> oauthLinkCodeTemplate) {
		this.oauthLinkCodeTemplate = oauthLinkCodeTemplate.opsForValue();
		this.verificationCodeTemplate = verificationCodeTemplate.opsForValue();
	}

	public void saveOauthLinkCode(String userId, String code) {
		oauthLinkCodeTemplate
				.set(code + OAUTH_LINK_SUFFIX,
						userId,
						Duration.ofMinutes(10)
				);
	}

	public String getUserIdByOauthLink(String code) {
		return oauthLinkCodeTemplate.get(code);
	}

	public void saveVerificationCode(String name, String code) {
		verificationCodeTemplate
				.set(name + VERIFICATION_CODE_SUFFIX,
						code,
						Duration.ofMinutes(3)
				);
	}

	public String getVerificationCode(String name) {
		return verificationCodeTemplate.get(name);
	}

	public void deleteVerificationCode(String name, String code) {
		verificationCodeTemplate.getAndDelete(name + VERIFICATION_CODE_SUFFIX);
	}

	public void deleteOauthLink(String code) {
		oauthLinkCodeTemplate.getAndDelete(code + OAUTH_LINK_SUFFIX);
	}
}
