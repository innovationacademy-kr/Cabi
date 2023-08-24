package org.ftclub.cabinet.redis;

import org.ftclub.cabinet.lent.domain.LentPolicyStatus;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class TicketingSharedCabinet {

	private final RedisTemplate<String, Integer> valueRedisTemplate;

	private final RedisTemplate<String, String> shadowKeyRedisTemplate;

	private final LentOptionalFetcher lentOptionalFetcher;

	@Autowired
	public TicketingSharedCabinet(RedisTemplate<String, Integer> valueRedisTemplate,
								  RedisTemplate<String, String> shadowKeyRedisTemplate,
								  LentOptionalFetcher lentOptionalFetcher) {
		this.lentOptionalFetcher = lentOptionalFetcher;
		this.valueRedisTemplate = valueRedisTemplate;
		this.shadowKeyRedisTemplate = shadowKeyRedisTemplate;
	}

//	/**
//	 * @param key      : cabinetId + suffix
//	 * @param hashKey: ${userName} 또는 "userCount"
//	 * @param pwCount: ${passwordCount} 또는 "userCount"
//	 */
//	public void saveValue(String key, String hashKey, Integer pwCount) {
//		valueRedisTemplate.opsForHash().put(key, hashKey, pwCount);
//	}

	/**
	 * @param key     : cabinetId + suffix
	 * @param hashKey : ${userName} 또는 "userCount"
	 */
	public void saveValue(String key, String hashKey) {
		if (isUserInValueKey(key, hashKey)) {
			valueRedisTemplate.opsForHash().put(key, hashKey, getValue(key, hashKey) + 1);
		} else {
			if (getSizeOfUsers(key) == 0) // 방장이 들어온 경우
			{
				valueRedisTemplate.opsForHash().put(key, hashKey, -1);
			} else // 방장 이후 유저가 들어올려고 시도한 경우
			{
				valueRedisTemplate.opsForHash().put(key, hashKey, 1);
			}
		}
	}

	public void validateShareCode() {

	}

	public Boolean isUserInValueKey(String key, String hashKey) {
		return valueRedisTemplate.opsForHash().hasKey(key, hashKey);
	}

	public Long getSizeOfUsers(String key) {
		return valueRedisTemplate.opsForHash().size(key);
	}

	public void checkSizeOfUsers(String key) {
		if (getSizeOfUsers(key) > 4) {
			lentOptionalFetcher.handlePolicyStatus(LentPolicyStatus.FULL_CABINET);
		}
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
