package org.ftclub.cabinet.redis;

import org.ftclub.cabinet.lent.repository.LentRedis;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class RedisRepositoryTest {

//	@Autowired
//	private RedisTemplate<String, Integer> valueRedisTemplate;
//
//	@Autowired
//	private RedisTemplate<String, String> shadowKeyRedisTemplate;

	@Autowired
	private LentRedis lentRedis;

	@Test
	@Disabled
	void test() {
		Long cabinetId = 16L;

		lentRedis.setShadowKey(cabinetId);
		lentRedis.saveUserInRedis("16L", "1234L", "1000", false);
		lentRedis.saveUserInRedis("16L", "5678L", "1000", true);

		try {
			Thread.sleep(10000);
		} catch (InterruptedException e) {
			System.out.println("interrupted");
		}
	}
}
