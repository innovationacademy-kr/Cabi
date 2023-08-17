package org.ftclub.cabinet.redis;

import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

@SpringBootTest
public class RedisRepositoryTest {
//	@Autowired
//	private TicketingCabinetRedisRepository repo;

	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	@Autowired
	private RedisTemplate<String, String> redisTemplate2;

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

//		final ValueOperations<String, String> stringStringValueOperations = redisTemplate2.opsForValue();

//		stringStringValueOperations.set(cabinetId, ""); // redis set 명령어

		setExpireTime(cabinetId);

		saveWithCustomPrefix(cabinetId + ":cabinet", "yubchoi", 0);

//		final Map<Object, Object> entries = redisTemplate.opsForHash().entries(cabinetId);
//		System.out.println(entries);
//
		saveWithCustomPrefix(cabinetId + ":cabinet", "daewoole", 1);
//
//		final Map<Object, Object> entries2 = redisTemplate.opsForHash().entries(cabinetId);
//		System.out.println(entries2);

		// search all entries by prefix
//		redisTemplate.opsForHash().keys(cabinetId).forEach(System.out::println);

		// sleep 10 sec
		try {
			Thread.sleep(10000);
		} catch (InterruptedException e) {
			System.out.println("interrupted");
		}
	}

	/**
	 * @param cabinetId
	 * @param hashKey:            ${userName} 또는 "userCount"
	 * @param wrongPasswordCount: ${wrongPasswordCount} 또는 ${userCount}
	 */
	public void saveWithCustomPrefix(String cabinetId, String hashKey, int wrongPasswordCount) {
		// 해당 키가 존재하는지 확인
//		boolean hasKey = Boolean.TRUE.equals(redisTemplate.hasKey(cabinetId));
		redisTemplate.opsForHash().put(cabinetId, hashKey, wrongPasswordCount);
//		redisTemplate.opsForHash().putAll(cabinetId, convertToMap(tc));	// hashKey를 설정하기 위해 putAll이 아닌 put을 사용했습니다.
		// 해당 키가 처음 생성된 것이라면 timeToLive 설정
//		if (!hasKey) {
//			System.out.println("set expire time");
//			// 30초 후에 삭제
//			redisTemplate.expire(cabinetId, 5, TimeUnit.SECONDS);
//		}
	}

	public void setExpireTime(String cabinetId) {
		// 해당 키가 존재하는지 확인
		boolean hasKey = Boolean.TRUE.equals(redisTemplate2.hasKey(cabinetId));
		redisTemplate2.opsForValue().set(cabinetId, "");
		// 해당 키가 처음 생성된 것이라면 timeToLive 설정
		if (!hasKey) {
			System.out.println("set expire time");
			// 5초 후에 삭제
			redisTemplate2.expire(cabinetId, 5, TimeUnit.SECONDS);
		}
	}

//	private Map<String, String> convertToMap(TicketingCabinet cabinet) {
//		Map<String, String> map = new HashMap<>();
//		map.put("userNameOrUserCount", cabinet.getUserNameOrUserCount());
//		map.put("wrongPasswordCountOrUserCount", String.valueOf(cabinet.getWrongPasswordCountOrUserCount()));
//		return map;
//	}

}
