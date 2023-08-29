package org.ftclub.cabinet.redis;

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
	private TicketingSharedCabinet ticketingSharedCabinet;

	@Test
	void test() {
		Long cabinetId = 16L;

		ticketingSharedCabinet.setShadowKey(cabinetId);
		ticketingSharedCabinet.saveValue(16L, 1234L, 0, false);
		ticketingSharedCabinet.saveValue(16L, 5678L, 0, false);

		try {
			Thread.sleep(10000);
		} catch (InterruptedException e) {
			System.out.println("interrupted");
		}
	}
}
