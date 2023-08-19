package org.ftclub.cabinet.redis;

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

	@Autowired
	private TicketingSharedCabinet ticketingSharedCabinet;

	@Test
	void test() {
		String cabinetId = "16";
		String suffix = ":cabinet";

		ticketingSharedCabinet.setShadowKey(cabinetId);
		ticketingSharedCabinet.saveValue(cabinetId + suffix, "yubchoi", 0);
		ticketingSharedCabinet.saveValue(cabinetId + suffix, "daewoole", 1);

		try {
			Thread.sleep(10000);
		} catch (InterruptedException e) {
			System.out.println("interrupted");
		}
	}
}
