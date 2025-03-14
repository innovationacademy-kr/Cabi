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

public class AguCodeRedis {

	public static final int EXPIRY_MIN = 3;
	private static final String AGU_CODE_SUFFIX = ":aguCode";
	private final ValueOperations<String, String> aguCodeTemplate;

	@Autowired
	public AguCodeRedis(RedisTemplate<String, String> redisTemplate) {
		this.aguCodeTemplate = redisTemplate.opsForValue();
	}

	public void saveAguCode(String name, String code) {
		aguCodeTemplate
				.set(name + AGU_CODE_SUFFIX,
						code,
						Duration.ofSeconds(30)
						// Duration.ofMinutes(EXPIRY_MIN)
				);
		String savedValue = aguCodeTemplate.get(name + AGU_CODE_SUFFIX);
		System.out.println("저장 키: " + name);
		System.out.println("저장된 값: " + savedValue);
	}

	public String findAguCodeByName(String name) {
		return aguCodeTemplate.get(name + AGU_CODE_SUFFIX);
	}

	public void deleteCode(String name) {
		aguCodeTemplate.getAndDelete(name + AGU_CODE_SUFFIX);
	}
}
