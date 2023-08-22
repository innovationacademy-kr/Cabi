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

	public Boolean isUserInValueKey(String key, String hashKey) {
		return valueRedisTemplate.opsForHash().hasKey(key, hashKey);
	}

	public Integer getValue(String key, String hashKey) {
		return (Integer) valueRedisTemplate.opsForHash().get(key, hashKey);
	}

	public void setShadowKey(String cabinetId) {
		// 해당 키가 존재하는지 확인
		shadowKeyRedisTemplate.opsForValue().set(cabinetId, "");
		// 해당 키가 처음 생성된 것이라면 timeToLive 설정
		System.out.println("set expire time");
		shadowKeyRedisTemplate.expire(cabinetId, 5, TimeUnit.SECONDS);
	}

	public Boolean isShadowKey(String cabinetId) {
		// 해당 키가 존재하는지 확인
		return shadowKeyRedisTemplate.hasKey(cabinetId);
//		boolean hasKey = Boolean.TRUE.equals(shadowKeyRedisTemplate.hasKey(cabinetId));
//		return hasKey;
	}
}
