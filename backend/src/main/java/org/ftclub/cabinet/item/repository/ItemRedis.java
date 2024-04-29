package org.ftclub.cabinet.item.repository;


import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@Logging(level = LogLevel.DEBUG)
public class ItemRedis {

	private static final String COIN_COUNT_KEY_SUFFIX = ":coinCount";
	private static final String COIN_COLLECT_KEY_SUFFIX = ":coinCollect";
	private static final String COIN_COLLECT_COUNT_KEY_SUFFIX = ":coinCollectCount";


	private final RedisTemplate<String, String> coinTemplate;

	@Autowired
	public ItemRedis(RedisTemplate<String, String> coinTemplate) {
		this.coinTemplate = coinTemplate;
	}

	public String getCoinCount(String userId) {
		return coinTemplate.opsForValue().get(userId + COIN_COUNT_KEY_SUFFIX);
	}

	public void saveCoinCount(String userId, String coinCount) {
		coinTemplate.opsForValue().set(userId + COIN_COUNT_KEY_SUFFIX, coinCount);
	}

	/**
	 * 하루동안 유지되는 redis를 탐색하여 동전줍기를 했는지 검수
	 *
	 * @param userId
	 * @return
	 */
	public boolean isCoinCollected(String userId) {
		Boolean isCollected = coinTemplate.hasKey(userId + COIN_COLLECT_KEY_SUFFIX);
		return Objects.nonNull(isCollected) && isCollected;
	}

	public String getCoinCollectionCount(String userId) {
		String key = userId + COIN_COLLECT_COUNT_KEY_SUFFIX;
		return coinTemplate.opsForValue().get(key);
	}

	/**
	 * 하루동안 유지되는 코인 줍기
	 * <p>
	 * 현재 시간부터 자정까지의 남은 시간을 초로 계산하여 expireTime 으로 저장합니다.
	 *
	 * @param userId
	 */
	public void collectCoin(String userId) {
		String key = userId + COIN_COLLECT_KEY_SUFFIX;
		coinTemplate.opsForValue().set(key, "collected");

		LocalDateTime todayEnd = LocalDate.now().atStartOfDay().plusDays(1);
		LocalDateTime now = LocalDateTime.now();
		Duration duration = Duration.between(now, todayEnd);

		long expireTime = duration.getSeconds();
		coinTemplate.expire(key, expireTime, TimeUnit.SECONDS);
	}

	/**
	 * 한 달 동안 유지되는 코인 줍기
	 *
	 * @param userId
	 */
	public void addCoinCollectionCount(String userId) {
		String key = userId + COIN_COLLECT_COUNT_KEY_SUFFIX;
		Long currentCount = coinTemplate.opsForValue().increment(key, 1);

		if (currentCount == 1) {
			LocalDate today = LocalDate.now();
			LocalDate lastDayOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());
			LocalDateTime endOfMonth = lastDayOfMonth.atTime(23, 59, 59);
			LocalDateTime now = LocalDateTime.now();

			Duration between = Duration.between(now, endOfMonth);
			long expireTime = between.getSeconds();
			coinTemplate.expire(key, expireTime, TimeUnit.SECONDS);
		}
	}

	public void saveCoinCollectionCount(String userId, String coinCollectionCount) {
		coinTemplate.opsForValue().set(userId + COIN_COLLECT_COUNT_KEY_SUFFIX, coinCollectionCount);
	}
}
