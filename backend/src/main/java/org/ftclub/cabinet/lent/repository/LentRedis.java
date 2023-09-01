package org.ftclub.cabinet.lent.repository;

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
public class LentRedis {

	private static final String MAX_SHARE_CODE_TRY = "3";
	private static final String USER_ENTERED = "entered";
	private static final String SHADOW_KEY_SUFFIX = ":shadow";
	private static final String VALUE_KEY_SUFFIX = ":user";
	private static final String PREVIOUS_USER_SUFFIX = ":previousUser";

	private final HashOperations<String, String, String> valueHashOperations;
	private final ValueOperations<String, String> valueOperations;
	private final RedisTemplate<String, String> shadowKeyRedisTemplate;
	private final ValueOperations<String, String> previousUserRedisTemplate;

	@Autowired
	public LentRedis(RedisTemplate<String, Object> valueHashRedisTemplate,
			RedisTemplate<String, String> valueRedisTemplate,
			RedisTemplate<String, String> shadowKeyRedisTemplate,
			RedisTemplate<String, String> previousUserRedisTemplate) {
		this.valueOperations = valueRedisTemplate.opsForValue();
		this.valueHashOperations = valueHashRedisTemplate.opsForHash();
		this.shadowKeyRedisTemplate = shadowKeyRedisTemplate;
		this.previousUserRedisTemplate = previousUserRedisTemplate.opsForValue();
	}

	/**
	 * @param cabinetId    : cabinetId
	 * @param userId       : userId
	 * @param shareCode    : 초대코드
	 * @param hasShadowKey : 최초 대여인지 아닌지 여부
	 */
	public void saveUserInRedis(String cabinetId, String userId, String shareCode,
			boolean hasShadowKey) {
		log.debug("called saveUserInRedis: {}, {}, {}, {}", cabinetId, userId, shareCode,
				hasShadowKey);
		if (!hasShadowKey || isValidShareCode(Long.valueOf(cabinetId),
				shareCode)) { // 방장이거나 초대코드를 맞게 입력한 경우
			valueHashOperations.put(cabinetId, userId,
					USER_ENTERED);    // userId를 hashKey로 하여 -1을 value로 저장 // TODO: -1 대신 새로운 플래그값 넣어도 될듯?
			valueOperations.set(userId + VALUE_KEY_SUFFIX,
					cabinetId);    // userId를 key로 하여 cabinetId를 value로 저장
		} else { // 초대코드가 틀린 경우
			if (valueHashOperations.hasKey(cabinetId, userId)) { // 이미 존재하는 유저인 경우
				System.out.println("value : " + valueHashOperations.get(cabinetId, userId));
				valueHashOperations.increment(cabinetId, userId, 1L);    // trialCount를 1 증가시켜서 저장
			} else { // 존재하지 않는 유저인 경우
				valueHashOperations.put(cabinetId, userId, "1");    // trialCount를 1로 저장
			}
			throw new ServiceException(ExceptionStatus.WRONG_SHARE_CODE);
		}
	}

	public boolean isValidShareCode(Long cabinetId, String shareCode) {
		log.debug("called isValidShareCode: {}, {}", cabinetId, shareCode);
		return Objects.equals(
				shadowKeyRedisTemplate.opsForValue().get(cabinetId + SHADOW_KEY_SUFFIX),
				shareCode);
	}

	public boolean checkPwTrialCount(String cabinetId, String userId) {
		log.debug("called checkPwTrialCount: {}, {}", cabinetId, userId);
		return Objects.equals(valueHashOperations.get(cabinetId, userId), MAX_SHARE_CODE_TRY);
	}

	public Boolean isUserInRedis(String cabinetId, String userId) {
		log.debug("called isUserInRedis: {}, {}", cabinetId, userId);
		return valueHashOperations.hasKey(cabinetId, userId);
	}

	public Long getSizeOfUsersInSession(String cabinetId) {
		log.debug("called getSizeOfUsersInSession: {}", cabinetId);
		Map<String, String> entries = valueHashOperations.entries(cabinetId);
		return entries.values().stream().filter(Objects::nonNull)
				.filter(value -> value.equals(USER_ENTERED))
				.count();
	}

	public String getPwTrialCountInRedis(String cabinetId, String userId) {
		log.debug("called getPwTrialCountInRedis: {}, {}", cabinetId, userId);
		return valueHashOperations.get(cabinetId, userId);
	}

	public String getShareCode(Long cabinetId) {
		log.debug("called getShareCode: {}", cabinetId);
		return shadowKeyRedisTemplate.opsForValue().get(cabinetId + SHADOW_KEY_SUFFIX);
	}

	public void setShadowKey(Long cabinetId) {
		Random rand = new Random();
		Integer shareCode = 1000 + rand.nextInt(9000);
		String shadowKey = cabinetId + SHADOW_KEY_SUFFIX;
		shadowKeyRedisTemplate.opsForValue().set(shadowKey, shareCode.toString());
		// 해당 키가 처음 생성된 것이라면 timeToLive 설정
		log.debug("called setShadowKey: {}, shareCode: {}", shadowKey, shareCode);
		shadowKeyRedisTemplate.expire(shadowKey, 30, TimeUnit.SECONDS);    // TODO: 10분으로 수정
	}

	public Boolean isShadowKey(Long cabinetId) {
		log.debug("called isShadowKey: {}", cabinetId);
		// 해당 키가 존재하는지 확인
		return shadowKeyRedisTemplate.hasKey(cabinetId + SHADOW_KEY_SUFFIX);
	}

	public void deleteShadowKey(Long cabinetId) {
		log.debug("called deleteShadowKey: {}", cabinetId);
		shadowKeyRedisTemplate.delete(cabinetId + SHADOW_KEY_SUFFIX);
	}

	public void deleteUserInRedis(String cabinetId, String userId) { // user를 지우는 delete
		log.debug("called deleteUserInRedis: {}, {}", cabinetId, userId);
		valueHashOperations.delete(cabinetId, userId);
		valueOperations.getOperations().delete(userId + VALUE_KEY_SUFFIX);
	}

	public void deleteCabinetIdInRedis(String cabinetId) {
		log.debug("called deleteCabinetIdInRedis: {}", cabinetId);
		valueHashOperations.getOperations().delete(cabinetId);
	}

	public void deleteUserIdInRedis(Long userId) {
		log.debug("called deleteUserIdInRedis: {}", userId);
		valueOperations.getOperations().delete(userId + VALUE_KEY_SUFFIX);
	}

	public Long findCabinetIdByUserIdInRedis(Long userId) {
		log.debug("Called findCabinetIdByUserIdInRedis: {}", userId);
		String cabinetId = valueOperations.get(userId + VALUE_KEY_SUFFIX);
		if (cabinetId == null) {
			log.info("cabinetId is null");
			return null;
		}
		return Long.valueOf(cabinetId);
	}

	public ArrayList<String> getUserIdsByCabinetIdInRedis(String cabinetId) {
		log.debug("Called getUserIdsByCabinetIdInRedis: {}", cabinetId);
		Map<String, String> entries = valueHashOperations.entries(cabinetId);
		return entries.entrySet().stream().filter(entry -> entry.getValue().equals(USER_ENTERED))
				.map(Map.Entry::getKey).collect(Collectors.toCollection(ArrayList::new));
	}

	public LocalDateTime getSessionExpiredAtInRedis(Long cabinetId) {
		log.debug("Called getSessionExpiredAtInRedis: {}", cabinetId);
		if (isShadowKey(cabinetId)) {
			return LocalDateTime.now().plusSeconds(
					shadowKeyRedisTemplate.getExpire(cabinetId + SHADOW_KEY_SUFFIX,
							TimeUnit.SECONDS).longValue());
		}
		return null;
	}

	public void setPreviousUser(String cabinetId, String userName) {
		log.debug("Called setPreviousUser: {}, {}", cabinetId, userName);
		previousUserRedisTemplate.set(cabinetId + PREVIOUS_USER_SUFFIX, userName);
	}

	public String getPreviousUser(String cabinetId) {
		log.debug("Called getPreviousUser: {}", cabinetId);
		return previousUserRedisTemplate.get(cabinetId + PREVIOUS_USER_SUFFIX);
	}
}
