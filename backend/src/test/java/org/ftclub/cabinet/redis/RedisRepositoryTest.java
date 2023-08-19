package org.ftclub.cabinet.redis;

import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

@SpringBootTest
public class RedisRepositoryTest {

	@Autowired
	private RedisTemplate<String, Integer> valueRedisTemplate;

	@Autowired
	private RedisTemplate<String, String> shadowKeyRedisTemplate;

	@Test
	void test() {
		String cabinetId = "16";
		String suffix = ":cabinet";

		setShadowKey(cabinetId);
		saveValue(cabinetId + suffix, "yubchoi", 0);
		saveValue(cabinetId + suffix, "daewoole", 1);

		try {
			Thread.sleep(10000);
		} catch (InterruptedException e) {
			System.out.println("interrupted");
		}
	}

	/**
	 * @param key                 : cabinetId + suffix
	 * @param hashKey:            ${userName} 또는 "userCount"
	 * @param wrongPasswordCount: ${wrongPasswordCount} 또는 ${userCount}
	 */
	public void saveValue(String key, String hashKey, Integer pwCount) {
		// 해당 키가 존재하는지 확인
//		boolean hasKey = Boolean.TRUE.equals(redisTemplate.hasKey(cabinetId));
		valueRedisTemplate.opsForHash().put(key, hashKey, pwCount);
	}

	public void setShadowKey(String cabinetId) {
		// 해당 키가 존재하는지 확인
		boolean hasKey = Boolean.TRUE.equals(shadowKeyRedisTemplate.hasKey(cabinetId));
		shadowKeyRedisTemplate.opsForValue().set(cabinetId, "");
		// 해당 키가 처음 생성된 것이라면 timeToLive 설정
		if (!hasKey) {
			System.out.println("set expire time");
			shadowKeyRedisTemplate.expire(cabinetId, 5, TimeUnit.SECONDS);
		}
	}
}
