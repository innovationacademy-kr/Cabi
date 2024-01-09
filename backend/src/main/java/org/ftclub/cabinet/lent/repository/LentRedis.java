package org.ftclub.cabinet.lent.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

@Component
@Logging(level = LogLevel.DEBUG)
public class LentRedis {

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


	/*-------------------------------------  Share Cabinet  --------------------------------------*/

	/**
	 * 공유 사물함에 대한 대여를 시도합니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @param userId    대여하려는 user id
	 * @param shareCode 공유 사물함 공유 코드
	 */
	public void attemptJoinCabinet(String cabinetId, String userId, String shareCode) {
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
			throw ExceptionStatus.WRONG_SHARE_CODE.asServiceException();
		}
	}

	/**
	 * 공유 사물함에 유저가 참여 중인지 확인합니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @param userId    확인하려는 user id
	 * @return 유저가 공유 사물함 세션에 있는지 여부
	 */
	public boolean isUserInCabinet(String cabinetId, String userId) {
		return shareCabinetTemplate.hasKey(cabinetId, userId);
	}

	/**
	 * 공유 사물함에 참여 중인 유저 수를 가져옵니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @return 공유 사물함 세션에 참여 중인 유저 수
	 */
	public Long countUserInCabinet(String cabinetId) {
		Collection<String> joinUsers = shareCabinetTemplate.entries(cabinetId).values();
		return joinUsers.parallelStream()
				.filter(value -> Objects.nonNull(value) && value.equals(USER_ENTERED)).count();
	}

	/**
	 * 공유 사물함에 대한 특정 유저의 대여 시도 횟수를 가져옵니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @param userId    확인하려는 user id
	 * @return 대여 시도 횟수
	 */
	public String getAttemptCountInCabinet(String cabinetId, String userId) {
		return shareCabinetTemplate.get(cabinetId, userId);
	}

	/**
	 * 공유 사물함 세션이 존재하는지 확인합니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @return 공유 사물함 세션이 존재하는지 여부
	 */
	public boolean isExistShadowKey(String cabinetId) {
		Boolean isExist = shadowKeyTemplate.hasKey(cabinetId + SHADOW_KEY_SUFFIX);
		return Objects.nonNull(isExist) && isExist;
	}

	/**
	 * 공유 사물함의 초대 코드를 가져옵니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @return 공유 사물함 초대 코드
	 */
	public String getShareCode(String cabinetId) {
		return shadowKeyTemplate.opsForValue().get(cabinetId + SHADOW_KEY_SUFFIX);
	}

	/**
	 * 공유 사물함 세션과 초대 코드를 새로 생성하고 생성된 초대 코드를 반환합니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @return 생성된 초대 코드
	 */
	public String setShadowKey(String cabinetId) {
		Random rand = new Random();
		String shareCode = Integer.toString(1000 + rand.nextInt(9000));
		String shadowKey = cabinetId + SHADOW_KEY_SUFFIX;
		shadowKeyTemplate.opsForValue().set(shadowKey, shareCode);
		shadowKeyTemplate.expire(shadowKey, cabinetProperties.getInSessionTerm(), TimeUnit.MINUTES);
		return shareCode;
	}

	/**
	 * 공유 사물함 세션을 삭제합니다.
	 *
	 * @param cabinetId 삭제할 공유 사물함 cabinet id
	 */
	public void deleteShadowKey(String cabinetId) {
		shadowKeyTemplate.delete(cabinetId + SHADOW_KEY_SUFFIX);
	}

	/**
	 * 특정 공유 사물함에 참여 중인 유저를 삭제합니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @param userId    삭제할 user id
	 */
	public void deleteUserInCabinet(String cabinetId, String userId) {
		shareCabinetTemplate.delete(cabinetId, userId);
		userCabinetTemplate.getOperations().delete(userId + VALUE_KEY_SUFFIX);
	}

	/**
	 * 공유 사물함을 삭제합니다.
	 *
	 * @param cabinetId 삭제할 공유 사물함 cabinet id
	 */
	public void deleteCabinet(String cabinetId) {
		shareCabinetTemplate.getOperations().delete(cabinetId);
	}

	/**
	 * 유저를 삭제합니다.
	 *
	 * @param userId 삭제할 user id
	 */
	public void deleteUser(Long userId) {
		userCabinetTemplate.getOperations().delete(userId + VALUE_KEY_SUFFIX);
	}

	/**
	 * 유저가 빌린 사물함을 가져옵니다.
	 *
	 * @param userId 유저 id
	 * @return 유저가 빌린 사물함 id
	 */
	public String findCabinetByUser(String userId) {
		return userCabinetTemplate.get(userId + VALUE_KEY_SUFFIX);
	}

	/**
	 * 공유 사물함에 참여 중인 유저를 모두 가져옵니다.
	 *
	 * @param cabinetId 공유 사물함 id
	 * @return 공유 사물함에 참여 중인 유저 id
	 */
	public List<String> getAllUserInCabinet(String cabinetId) {
		Map<String, String> entries = shareCabinetTemplate.entries(cabinetId);
		return entries.entrySet().stream()
				.filter(entry -> entry.getValue().equals(USER_ENTERED))
				.map(Map.Entry::getKey).collect(Collectors.toList());
	}

	/**
	 * 공유 사물함의 만료 시간을 가져옵니다.
	 *
	 * @param cabinetId 공유 사물함 id
	 * @return 공유 사물함의 만료 시간
	 */
	public LocalDateTime getCabinetExpiredAt(String cabinetId) {
		if (this.isExistShadowKey(cabinetId)) {
			String shadowKey = cabinetId + SHADOW_KEY_SUFFIX;
			long expire = shadowKeyTemplate.getExpire(shadowKey, TimeUnit.SECONDS).longValue();
			return LocalDateTime.now().plusSeconds(expire);
		}
		return null;
	}

	/*----------------------------------------  Caching  -----------------------------------------*/

	/**
	 * 특정 사물함에 대한 이전 대여 유저 이름을 설정합니다.
	 *
	 * @param cabinetId 사물함 id
	 * @param userName  유저 이름
	 */
	public void setPreviousUserName(String cabinetId, String userName) {
		previousUserTemplate.set(cabinetId + PREVIOUS_USER_SUFFIX, userName);
	}

	/**
	 * 특정 사물함에 대한 이전 대여 유저 이름을 가져옵니다.
	 *
	 * @param cabinetId 사물함 id
	 * @return 유저 이름
	 */
	public String getPreviousUserName(String cabinetId) {
		return previousUserTemplate.get(cabinetId + PREVIOUS_USER_SUFFIX);
	}
}
