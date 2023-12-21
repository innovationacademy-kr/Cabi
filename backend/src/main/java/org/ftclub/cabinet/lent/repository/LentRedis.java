package org.ftclub.cabinet.lent.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
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

	private final HashOperations<String, String, String> shareCabinetTemplate;
	private final ValueOperations<String, String> userCabinetTemplate;
	private final RedisTemplate<String, String> shadowKeyTemplate;
	private final ValueOperations<String, String> previousUserTemplate;
	private final CabinetProperties cabinetProperties;

	@Autowired
	public LentRedis(RedisTemplate<String, Object> valueHashRedisTemplate,
			RedisTemplate<String, String> valueRedisTemplate,
			RedisTemplate<String, String> shadowKeyTemplate,
			RedisTemplate<String, String> previousUserTemplate,
			CabinetProperties cabinetProperties) {
		this.userCabinetTemplate = valueRedisTemplate.opsForValue();
		this.shareCabinetTemplate = valueHashRedisTemplate.opsForHash();
		this.shadowKeyTemplate = shadowKeyTemplate;
		this.previousUserTemplate = previousUserTemplate.opsForValue();
		this.cabinetProperties = cabinetProperties;
	}

	/**
	 * @param cabinetId : cabinetId
	 * @param userId    : userId
	 * @param shareCode : 초대코드
	 */
	public void attemptJoinCabinet(String cabinetId, String userId, String shareCode) {
		log.debug("called saveUserInRedis: {}, {}, {}", cabinetId, userId, shareCode);

		String savedCode = shadowKeyTemplate.opsForValue().get(cabinetId + SHADOW_KEY_SUFFIX);
		if (Objects.equals(savedCode, shareCode)) {
			shareCabinetTemplate.put(cabinetId, userId, USER_ENTERED);
			userCabinetTemplate.set(userId + VALUE_KEY_SUFFIX, cabinetId);
		} else {
			if (shareCabinetTemplate.hasKey(cabinetId, userId)) {
				shareCabinetTemplate.increment(cabinetId, userId, 1L);
			} else {
				shareCabinetTemplate.put(cabinetId, userId, "1");
			}
			throw new DomainException(ExceptionStatus.WRONG_SHARE_CODE);
		}
	}

	public boolean isUserInCabinet(String cabinetId, String userId) {
		log.debug("called isUserInRedis: {}, {}", cabinetId, userId);

		return shareCabinetTemplate.hasKey(cabinetId, userId);
	}

	public Long countUserInCabinet(String cabinetId) {
		log.debug("called getSizeOfUsersInSession: {}", cabinetId);

		Collection<String> joinUsers = shareCabinetTemplate.entries(cabinetId).values();
		return joinUsers.parallelStream()
				.filter(value -> Objects.nonNull(value) && value.equals(USER_ENTERED)).count();
	}

	public String getAttemptCountInCabinet(String cabinetId, String userId) {
		log.debug("called getPwTrialCountInRedis: {}, {}", cabinetId, userId);

		return shareCabinetTemplate.get(cabinetId, userId);
	}

	public boolean isExistShadowKey(String cabinetId) {
		log.debug("called isShadowKey: {}", cabinetId);

		Boolean isExist = shadowKeyTemplate.hasKey(cabinetId + SHADOW_KEY_SUFFIX);
		return Objects.nonNull(isExist) && isExist;
	}

	public String getShareCode(String cabinetId) {
		log.debug("called getShareCode: {}", cabinetId);

		return shadowKeyTemplate.opsForValue().get(cabinetId + SHADOW_KEY_SUFFIX);
	}

	public String setShadowKey(String cabinetId) {
		log.debug("called setShadowKey: {}", cabinetId);

		Random rand = new Random();
		String shareCode = Integer.toString(1000 + rand.nextInt(9000));
		String shadowKey = cabinetId + SHADOW_KEY_SUFFIX;
		shadowKeyTemplate.opsForValue().set(shadowKey, shareCode);
		shadowKeyTemplate.expire(shadowKey, cabinetProperties.getInSessionTerm(), TimeUnit.MINUTES);
		return shareCode;
	}

	public void deleteShadowKey(String cabinetId) {
		log.debug("called deleteShadowKey: {}", cabinetId);

		shadowKeyTemplate.delete(cabinetId + SHADOW_KEY_SUFFIX);
	}

	public void deleteUserInCabinet(String cabinetId, String userId) {
		log.debug("called deleteUserInRedis: {}, {}", cabinetId, userId);

		shareCabinetTemplate.delete(cabinetId, userId);
		userCabinetTemplate.getOperations().delete(userId + VALUE_KEY_SUFFIX);
	}

	public void deleteCabinet(String cabinetId) {
		log.debug("called deleteCabinetIdInRedis: {}", cabinetId);

		shareCabinetTemplate.getOperations().delete(cabinetId);
	}

	public void deleteUser(Long userId) {
		log.debug("called deleteUserIdInRedis: {}", userId);

		userCabinetTemplate.getOperations().delete(userId + VALUE_KEY_SUFFIX);
	}

	public String findCabinetByUser(String userId) {
		log.debug("Called findCabinetIdByUserIdInRedis: {}", userId);

		return userCabinetTemplate.get(userId + VALUE_KEY_SUFFIX);
	}

	public List<String> getAllUserInCabinet(String cabinetId) {
		log.debug("Called getUserIdsByCabinetIdInRedis: {}", cabinetId);

		Map<String, String> entries = shareCabinetTemplate.entries(cabinetId);
		return entries.entrySet().stream()
				.filter(entry -> entry.getValue().equals(USER_ENTERED))
				.map(Map.Entry::getKey).collect(Collectors.toList());
	}

	public LocalDateTime getCabinetExpiredAt(String cabinetId) {
		log.debug("Called getSessionExpiredAtInRedis: {}", cabinetId);
		if (this.isExistShadowKey(cabinetId)) {
			String shadowKey = cabinetId + SHADOW_KEY_SUFFIX;
			long expire = shadowKeyTemplate.getExpire(shadowKey, TimeUnit.SECONDS).longValue();
			return LocalDateTime.now().plusSeconds(expire);
		}
		return null;
	}

	/*----------------------------------------  Caching  -----------------------------------------*/

	public void setPreviousUserName(String cabinetId, String userName) {
		log.debug("Called setPreviousUser: {}, {}", cabinetId, userName);
		previousUserTemplate.set(cabinetId + PREVIOUS_USER_SUFFIX, userName);
	}

	public String getPreviousUserName(String cabinetId) {
		log.debug("Called getPreviousUser: {}", cabinetId);
		return previousUserTemplate.get(cabinetId + PREVIOUS_USER_SUFFIX);
	}
}
