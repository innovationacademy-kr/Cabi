package org.ftclub.cabinet.redis;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@SpringBootTest
public class RedisRepositoryTest {
//	@Autowired
//	private TicketingCabinetRedisRepository repo;

	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	@Test
	void test() {
//		/* test2: key도 설정 가능한지 대충 테스트  */
//		Integer cabinetId = 16;
//		String key = String.valueOf(cabinetId);
//		HashOperations<String, String, Integer> stringObjectObjectHashOperations = redisTemplate.opsForHash();
//		stringObjectObjectHashOperations.put(key, "yubchoi", 0);
//		stringObjectObjectHashOperations.put(key, "wchae", 1);
////		stringObjectObjectHashOperations.put(key, "Hi03", "orange");
//
//		final Object get = stringObjectObjectHashOperations.get(key, "yubchoi");
//		System.out.println(get);
//
//		final Map<String, Integer> entries = stringObjectObjectHashOperations.entries(key);
//		Assertions.assertThat(entries.get("yubchoi")).isEqualTo(0);
//
//		final Long size = stringObjectObjectHashOperations.size(key);
//		Assertions.assertThat(size).isEqualTo(2);
//
//		/* test1: hashKey만 설정 가능 */
//		TicketingCabinet ticketingCabinet = new TicketingCabinet("daewoole", 1);
//
//		// set TicketingCabinet redis key
//
//
//		repo.save(ticketingCabinet);
//
//		Optional<TicketingCabinet> tc = repo.findById(ticketingCabinet.getId());
//		tc.ifPresent(value -> System.out.println(value.getWrongPasswordCountOrUserCount()));

		/* test3: key 설정 가능하게 */


		String cabinetId = "16";
		String userName = "yubchoi";
		int wrongPasswordCount = 0;
		TicketingCabinet ticketingCabinet = new TicketingCabinet(userName, wrongPasswordCount);
		saveWithCustomPrefix(cabinetId, ticketingCabinet);

		final Map<Object, Object> entries = redisTemplate.opsForHash().entries(cabinetId + ":" + userName);
		System.out.println(entries);

		userName = "daewoole";
		wrongPasswordCount = 1;
		TicketingCabinet ticketingCabinet2 = new TicketingCabinet(userName, wrongPasswordCount);
		saveWithCustomPrefix(cabinetId, ticketingCabinet2);

		final Map<Object, Object> entries2 = redisTemplate.opsForHash().entries(cabinetId + ":" + userName);
		System.out.println(entries2);

		// search all entries by prefix
//		final Map<Object, Object> entries3 = redisTemplate.opsForHash().entries(cabinetId);
//		System.out.println(entries3);
		redisTemplate.opsForHash().keys(cabinetId).forEach(System.out::println);
	}

	public void saveWithCustomPrefix(String prefix, TicketingCabinet cabinet) {
		String key = prefix + ":" + cabinet.getUserNameOrUserCount();
		redisTemplate.opsForHash().putAll(key, convertToMap(cabinet));
		// timeToLive 설정
		redisTemplate.expire(key, 10, TimeUnit.SECONDS);
	}

	private Map<String, String> convertToMap(TicketingCabinet cabinet) {
		Map<String, String> map = new HashMap<>();
//		map.put("cabinetId", cabinet.getCabinetId());
		map.put("userNameOrUserCount", cabinet.getUserNameOrUserCount());
		map.put("wrongPasswordCountOrUserCount", String.valueOf(cabinet.getWrongPasswordCountOrUserCount()));
//		map.put("createdAt", cabinet.getCreatedAt());
		return map;
	}

}
