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
	private static final String USER_SWAPPED = "swapped";

	private static final String SHADOW_KEY_SUFFIX = ":shadow";
	private static final String CABINET_KEY_SUFFIX = ":cabinetSession";
	private static final String VALUE_KEY_SUFFIX = ":userSession";

	private static final String PREVIOUS_USER_SUFFIX = ":previousUser";
	private static final String PREVIOUS_ENDED_AT_SUFFIX = ":previousEndedAt";

	private static final String SWAP_KEY_SUFFIX = ":swap";

	private final HashOperations<String, String, String> shareCabinetTemplate;
	private final ValueOperations<String, String> userCabinetTemplate;
	private final RedisTemplate<String, String> shadowKeyTemplate; //조금 더 많은 기능을 지원

	private final ValueOperations<String, String> previousTemplate; // 조회랑 생성 한정 기능


	private final RedisTemplate<String, String> swapTemplate;
	private final CabinetProperties cabinetProperties;

	@Autowired
	public LentRedis(RedisTemplate<String, Object> valueHashRedisTemplate,
			RedisTemplate<String, String> valueRedisTemplate,
			RedisTemplate<String, String> shadowKeyTemplate,
			RedisTemplate<String, String> previousTemplate,
			RedisTemplate<String, String> swapTemplate,
			CabinetProperties cabinetProperties) {
		this.userCabinetTemplate = valueRedisTemplate.opsForValue();
		this.shareCabinetTemplate = valueHashRedisTemplate.opsForHash();
		this.shadowKeyTemplate = shadowKeyTemplate;
		this.previousTemplate = previousTemplate.opsForValue();
		this.swapTemplate = swapTemplate;
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
		String cabinetKey = cabinetId + CABINET_KEY_SUFFIX;
		if (Objects.equals(savedCode, shareCode)) {
			shareCabinetTemplate.put(cabinetKey, userId, USER_ENTERED);
			userCabinetTemplate.set(userId + VALUE_KEY_SUFFIX, cabinetId);
		} else {
			if (shareCabinetTemplate.hasKey(cabinetKey, userId)) {
				shareCabinetTemplate.increment(cabinetKey, userId, 1L);
			} else {
				shareCabinetTemplate.put(cabinetKey, userId, "1");
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
		return shareCabinetTemplate.hasKey(cabinetId + CABINET_KEY_SUFFIX, userId);
	}

	/**
	 * 공유 사물함에 참여 중인 유저 수를 가져옵니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @return 공유 사물함 세션에 참여 중인 유저 수
	 */
	public Long countUserInCabinet(String cabinetId) {
		String cabinetKey = cabinetId + CABINET_KEY_SUFFIX;
		Collection<String> joinUsers = shareCabinetTemplate.entries(cabinetKey).values();
		return joinUsers.stream()
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
		return shareCabinetTemplate.get(cabinetId + CABINET_KEY_SUFFIX, userId);
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
		shareCabinetTemplate.delete(cabinetId + CABINET_KEY_SUFFIX, userId);
		userCabinetTemplate.getOperations().delete(userId + VALUE_KEY_SUFFIX);
	}

	/**
	 * 공유 사물함을 삭제합니다.
	 *
	 * @param cabinetId 삭제할 공유 사물함 cabinet id
	 */
	public void deleteCabinet(String cabinetId) {
		shareCabinetTemplate.getOperations().delete(cabinetId + CABINET_KEY_SUFFIX);
	}

	/**
	 * 유저를 삭제합니다.
	 *
	 * @param userId 삭제할 user id
	 */
	public void deleteUser(String userId) {
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
		Map<String, String> entries = shareCabinetTemplate.entries(cabinetId + CABINET_KEY_SUFFIX);
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
		if (!this.isExistShadowKey(cabinetId)) {
			return null;
		}
		String shadowKey = cabinetId + SHADOW_KEY_SUFFIX;
		@SuppressWarnings("ConstantConditions")
		long expire = shadowKeyTemplate.getExpire(shadowKey, TimeUnit.SECONDS);
		return LocalDateTime.now().plusSeconds(expire);
	}

	/*----------------------------------------  Caching  -----------------------------------------*/

	/**
	 * 특정 사물함에 대한 이전 대여 유저 이름을 설정합니다.
	 *
	 * @param cabinetId 사물함 id
	 * @param userName  유저 이름
	 */
	public void setPreviousUserName(String cabinetId, String userName) {
		previousTemplate.set(cabinetId + PREVIOUS_USER_SUFFIX, userName);
	}

	/**
	 * 특정 사물함에 대한 이전 대여 유저 이름을 가져옵니다.
	 *
	 * @param cabinetId 사물함 id
	 * @return 유저 이름
	 */
	public String getPreviousUserName(String cabinetId) {
		return previousTemplate.get(cabinetId + PREVIOUS_USER_SUFFIX);
	}

	/**
	 * 특정 사물함에 대한 이전 대여 종료 시각을 설정합니다.
	 *
	 * @param cabinetId 사물함 id
	 * @param endedAt   종료 시각
	 */
	public void setPreviousEndedAt(String cabinetId, String endedAt) {
		previousTemplate.set(cabinetId + PREVIOUS_ENDED_AT_SUFFIX, endedAt);
	}

	/**
	 * 특정 사물함에 대한 이전 대여 종료 시각을 가져옵니다.
	 *
	 * @param cabinetId 사물함 id
	 * @return 종료 시각
	 */
	public String getPreviousEndedAt(String cabinetId) {
		return previousTemplate.get(cabinetId + PREVIOUS_ENDED_AT_SUFFIX);
	}

	/*-----------------------------------SWAP-----------------------------------*/

	public boolean isExistSwapRecord(String userId) {
		Boolean isExist = swapTemplate.hasKey(userId + SWAP_KEY_SUFFIX);
		return Objects.nonNull(isExist) && isExist;
	}

	public LocalDateTime getSwapExpiredAt(String userId) {
		if (!this.isExistSwapRecord(userId)) {
			return null;
		}
		String swapKey = userId + SWAP_KEY_SUFFIX;
		@SuppressWarnings("ConstantConditions")
		long expire = swapTemplate.getExpire(swapKey, TimeUnit.SECONDS);
		return LocalDateTime.now().plusSeconds(expire);
	}

	public void setSwap(String userId) {
		final String swapKey = userId + SWAP_KEY_SUFFIX;
		swapTemplate.opsForValue().set(swapKey, USER_SWAPPED);
		swapTemplate.expire(swapKey, cabinetProperties.getSwapTermPrivateDays(), TimeUnit.DAYS);
	}
}
