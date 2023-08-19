package org.ftclub.cabinet.redis;

import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class TicketingSharedCabinet {

	@Autowired
	private RedisTemplate<String, Integer> valueRedisTemplate;

	@Autowired
	private RedisTemplate<String, String> shadowKeyRedisTemplate;

	/**
	 * @param key      : cabinetId + suffix
	 * @param hashKey: ${userName} 또는 "userCount"
	 * @param pwCount: ${passwordCount} 또는 "userCount"
	 */
	public void saveValue(String key, String hashKey, Integer pwCount) {
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
