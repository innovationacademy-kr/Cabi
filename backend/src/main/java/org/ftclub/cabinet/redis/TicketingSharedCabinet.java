package org.ftclub.cabinet.redis;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

@Component
@Log4j2
public class TicketingSharedCabinet {

	private static final String MAX_SHARE_CODE_TRY = "3";
	private static final String USER_ENTERED = "entered";
	private static final String SHADOW_KEY_SUFFIX = ":shadow";
	private static final String VALUE_KEY_SUFFIX = ":user";

	private final HashOperations<String, String, String> valueHashOperations;
	private final ValueOperations<String, String> valueOperations;
	private final RedisTemplate<String, String> shadowKeyRedisTemplate;

	@Autowired
	public TicketingSharedCabinet(RedisTemplate<String, Object> valueHashRedisTemplate,
			RedisTemplate<String, String> valueRedisTemplate,
			RedisTemplate<String, String> shadowKeyRedisTemplate) {
		this.valueOperations = valueRedisTemplate.opsForValue();
		this.valueHashOperations = valueHashRedisTemplate.opsForHash();
		this.shadowKeyRedisTemplate = shadowKeyRedisTemplate;
	}

	/**
	 * @param key          : cabinetId
	 * @param hashKey      : userId
	 * @param shareCode    : 초대코드
	 * @param hasShadowKey : 최초 대여인지 아닌지 여부
	 */
	public void saveValue(String key, String hashKey, String shareCode, boolean hasShadowKey) {
		if (!hasShadowKey || isValidShareCode(Long.valueOf(key),
				shareCode)) { // 방장이거나 초대코드를 맞게 입력한 경우
			valueHashOperations.put(key, hashKey,
					USER_ENTERED);    // userId를 hashKey로 하여 -1을 value로 저장 // TODO: -1 대신 새로운 플래그값 넣어도 될듯?
			valueOperations.set(hashKey + VALUE_KEY_SUFFIX,
					key);    // userId를 key로 하여 cabinetId를 value로 저장
		} else { // 초대코드가 틀린 경우
			if (valueHashOperations.hasKey(key, hashKey)) { // 이미 존재하는 유저인 경우
				valueHashOperations.increment(key, hashKey, 1L);    // trialCount를 1 증가시켜서 저장
			} else { // 존재하지 않는 유저인 경우
				valueHashOperations.put(key, hashKey, "1");    // trialCount를 1로 저장
			}
			throw new ServiceException(ExceptionStatus.WRONG_SHARE_CODE);
		}
	}

	public boolean isValidShareCode(Long key, String shareCode) {
		return Objects.equals(shadowKeyRedisTemplate.opsForValue().get(key + SHADOW_KEY_SUFFIX),
				shareCode);
	}

	public boolean checkPwTrialCount(String key, String hashKey) {
		return Objects.equals(valueHashOperations.get(key, hashKey), "3");
	}

	public Boolean isUserInValueKey(String key, String hashKey) {
		return valueHashOperations.hasKey(key, hashKey);
	}

	public Long getSizeOfUsers(String key) {
		Map<String, String> entries = valueHashOperations.entries(key);
		return entries.values().stream().filter(Objects::nonNull)
				.filter(value -> value.equals(USER_ENTERED))
				.count();
	}

	public String getValue(String key, String hashKey) {
		return valueHashOperations.get(key, hashKey);
	}

	public String getShareCode(Long key) {
		return shadowKeyRedisTemplate.opsForValue().get(key + SHADOW_KEY_SUFFIX);
	}

	public void setShadowKey(Long cabinetId) {
		Random rand = new Random();
		Integer shareCode = 1000 + rand.nextInt(9000);
//		int shareCode = 1000;
		String key = cabinetId + SHADOW_KEY_SUFFIX;
		shadowKeyRedisTemplate.opsForValue().set(key, shareCode.toString());
		// 해당 키가 처음 생성된 것이라면 timeToLive 설정
		log.debug("setShadowKey: {}, shareCode: {}", key, shareCode);
		shadowKeyRedisTemplate.expire(key, 30, TimeUnit.SECONDS);    // TODO: 10분으로 수정
	}

	public Boolean isShadowKey(Long cabinetId) {
		// 해당 키가 존재하는지 확인
		return shadowKeyRedisTemplate.hasKey(cabinetId + SHADOW_KEY_SUFFIX);
	}

	public void deleteShadowKey(Long cabinetId) {
		shadowKeyRedisTemplate.delete(cabinetId + SHADOW_KEY_SUFFIX);
	}

	public void deleteUserInValueKey(String key, Long hashKey) { // user를 지우는 delete
		valueHashOperations.delete(key, hashKey.toString());
		valueOperations.getOperations().delete(hashKey + VALUE_KEY_SUFFIX);
	}

	public void deleteHashKey(String key) {
		valueHashOperations.getOperations().delete(key);
	}

	public void deleteValueKey(Long key) {
		valueOperations.getOperations().delete(key + VALUE_KEY_SUFFIX);
	}

	public Long findCabinetIdByUserId(Long userId) {
		log.debug("userId: {}", userId);
		String cabinetId = valueOperations.get(userId + VALUE_KEY_SUFFIX);
		if (cabinetId == null) {
			log.info("cabinetId is null");
			return null;
		}
		return Long.valueOf(cabinetId);
	}

	public ArrayList<String> getUserIdsByCabinetId(String cabinetId) {
		Map<String, String> entries = valueHashOperations.entries(cabinetId);
		return entries.entrySet().stream().filter(entry -> entry.getValue().equals(USER_ENTERED))
				.map(Map.Entry::getKey).collect(Collectors.toCollection(ArrayList::new));
	}

	public LocalDateTime getSessionExpiredAt(Long cabinetId) {
		if (isShadowKey(cabinetId)) {
			return LocalDateTime.now().plusSeconds(
					shadowKeyRedisTemplate.getExpire(cabinetId + SHADOW_KEY_SUFFIX,
							TimeUnit.SECONDS).longValue());
		}
		return null;
	}
}
