package org.ftclub.cabinet.redis;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.concurrent.TimeUnit;

@SpringBootTest
public class RedisRepositoryTest {

	@Autowired
	private RedisTemplate<String, Integer> valueRedisTemplate;

	@Autowired
	private RedisTemplate<String, String> shadowKeyRedisTemplate;

	@Test
	void test() {
		String cabinetId = "16";
		String shadow_suffix = ":shadow";

		// 16:shadow
		String shadowKey = cabinetId + shadow_suffix;

		setShadowKey(shadowKey);
		saveValue(cabinetId, "yubchoi", 0);
		saveValue(cabinetId, "daewoole", 1);

		try {
			Thread.sleep(10000);
		} catch (InterruptedException e) {
			System.out.println("interrupted");
		}
	}

	/**
	 * @param key                 : cabinetId + suffix
	 * @param hashKey:            ${userName} 또는 "userCount"
	 * @param pwCount: ${wrongPasswordCount} 또는 ${userCount}
	 */
	public void saveValue(String key, String hashKey, Integer pwCount) {
		// 해당 키가 존재하는지 확인
		valueRedisTemplate.opsForHash().put(key, hashKey, pwCount);
	}

	/**
	 * shadow key를 생성하고 timeToLive 설정
	 * 현재 로직 상 setShadowKey는 첫 번째 유저 호출에만 사용되므로 hasKey를 사용할 필요가 없음.
	 * 일단 주석처리
	 *
	 * @param cabinetId
	 */
	public void setShadowKey(String cabinetId) {
//		// 해당 키가 존재하는지 확인
//		boolean hasKey = Boolean.TRUE.equals(shadowKeyRedisTemplate.hasKey(cabinetId));
//		// 해당 키가 처음 생성된 것이라면 timeToLive 설정
//		if (!hasKey) {
		System.out.println("set expire time");
		shadowKeyRedisTemplate.opsForValue().set(cabinetId, "");
		shadowKeyRedisTemplate.expire(cabinetId, 5, TimeUnit.SECONDS);
//		}
	}
}
