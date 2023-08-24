package org.ftclub.cabinet.redis;

import java.util.ArrayList;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class TicketingSharedCabinet {

	private static final Integer MAX_SHARE_CODE_TRY = 3;

	private final RedisTemplate<Long, ?> valueRedisTemplate;
	private final HashOperations<Long, Long, Integer> valueHashOperations;
	private final RedisTemplate<Long, Integer> shadowKeyRedisTemplate;

	@Autowired
	public TicketingSharedCabinet(RedisTemplate<Long, ?> valueRedisTemplate,
			RedisTemplate<Long, Integer> shadowKeyRedisTemplate) {
		this.valueRedisTemplate = valueRedisTemplate;
		this.valueHashOperations = this.valueRedisTemplate.opsForHash();
		this.shadowKeyRedisTemplate = shadowKeyRedisTemplate;
	}

//	/**
//	 * @param key     : cabinetId + suffix
//	 * @param hashKey : ${userName} 또는 "userCount"
//	 */
//	public void saveValue(Long key, Long hashKey) {
//		if (isUserInValueKey(key, hashKey)) {
//			valueHashOperations.put(key, hashKey, getValue(key, hashKey) + 1);
//		} else {
//			if (getSizeOfUsers(key) == 0) // (최초에) 방장이 들어온 경우
//			{
//				valueHashOperations.put(key, hashKey, -1);
//			} else // 방장 이후 유저가 들어올려고 시도한 경우
//			{
//				valueHashOperations.put(key, hashKey, 1);
//			}
//		}
//	}

	/**
	 * @param key         : cabinetId
	 * @param hashKey     : userId
	 * @param shareCode   : 초대코드
	 * @param isFirstLent : 최초 대여인지 아닌지 여부
	 */
	public void saveValue(Long key, Long hashKey, Integer shareCode, boolean isFirstLent) {
		if (isFirstLent || isValidShareCode(key, shareCode)) { // 방장이거나 초대코드를 맞게 입력한 경우
			valueHashOperations.put(key, hashKey, -1);
		} else { // 초대코드가 틀린 경우
			int trialCount =
					valueHashOperations.get(key, hashKey) != null ? getValue(key, hashKey) : 0;
			valueHashOperations.put(key, hashKey, trialCount + 1);
			throw new ServiceException(ExceptionStatus.WRONG_SHARE_CODE);
		}
	}

	public boolean isValidShareCode(Long key, Integer shareCode) {
		return Objects.equals(shadowKeyRedisTemplate.opsForValue().get(key), shareCode);
	}

	public boolean checkPwTrialCount(Long key, Long hashKey) {
		return Objects.equals(valueHashOperations.get(key, hashKey), MAX_SHARE_CODE_TRY);
	}

	public Boolean isUserInValueKey(Long key, Long hashKey) {
		return valueHashOperations.hasKey(key, hashKey);
	}

	public Long getSizeOfUsers(Long key) {
		Map<Long, Integer> entries = valueHashOperations.entries(key);
		return entries.values().stream().filter(Objects::nonNull).filter(value -> value.equals(-1))
				.count();
	}

	public ArrayList<Long> getUserIdList(Long key) {
		Map<Long, Integer> entries = valueHashOperations.entries(key);
		// value가 -1인 데이터의 keys 반환
		return entries.entrySet().stream().filter(entry -> entry.getValue().equals(-1)).map(
				Map.Entry::getKey).collect(Collectors.toCollection(ArrayList::new));
	}

//	public void checkSizeOfUsers(String key) {
////		if (getSizeOfUsers(key) > 4) {
////			LentPolicyImpl.handlePolicyStatus(LentPolicyStatus.FULL_CABINET);
//		if (getSizeOfUsers(key) == 4)
//		}
//	}

	public Integer getValue(Long key, Long hashKey) {
		return valueHashOperations.get(key, hashKey);
	}

	public void setShadowKey(Long cabinetId) {
		Random rand = new Random();
		int shareCode = 1000 + rand.nextInt(9000);
		shadowKeyRedisTemplate.opsForValue().set(cabinetId, shareCode);
		// 해당 키가 처음 생성된 것이라면 timeToLive 설정
		System.out.println("set expire time");
		shadowKeyRedisTemplate.expire(cabinetId, 5, TimeUnit.SECONDS);
	}

	public Boolean isShadowKey(Long cabinetId) {
		// 해당 키가 존재하는지 확인
		return shadowKeyRedisTemplate.hasKey(cabinetId);
	}
}
