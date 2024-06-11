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

	private static final String COIN_COUNT_KEY_SUFFIX = ":coinAmount";
	private static final String COIN_COLLECT_KEY_SUFFIX = ":coinCollect";
	private static final String COIN_COLLECT_COUNT_KEY_SUFFIX = ":coinCollectCount";
	private static final String TOTAL_COIN_SUPPLY_KEY_SUFFIX = "totalCoinSupply";
	private static final String TOTAL_COIN_USAGE_KEY_SUFFIX = "totalCoinUsage";


	private final RedisTemplate<String, String> coinTemplate;

	@Autowired
	public ItemRedis(RedisTemplate<String, String> coinTemplate) {
		this.coinTemplate = coinTemplate;
	}

	public String getCoinAmount(String userId) {
		return coinTemplate.opsForValue().get(userId + COIN_COUNT_KEY_SUFFIX);
	}

	public void saveCoinAmount(String userId, String coinCount) {
		coinTemplate.opsForValue().set(userId + COIN_COUNT_KEY_SUFFIX, coinCount);
	}

	/**
	 * 전체 동전 발행량 반환
	 *
	 * @return
	 */
	public String getTotalCoinSupply() {
		return coinTemplate.opsForValue().get(TOTAL_COIN_SUPPLY_KEY_SUFFIX);
	}

	/**
	 * 전체 동전 사용량 반환
	 *
	 * @return
	 */
	public String getTotalcoinUsage() {
		return coinTemplate.opsForValue().get(TOTAL_COIN_USAGE_KEY_SUFFIX);
	}

	/**
	 * 전체 동전 발행량 저장
	 *
	 * @param coinSupply
	 */

	public void saveTotalCoinSupply(String coinSupply) {
		coinTemplate.opsForValue().set(TOTAL_COIN_SUPPLY_KEY_SUFFIX, coinSupply);
	}

	/**
	 * 전체 동전 사용량 저장
	 *
	 * @param coinUsage
	 */
	public void saveTotalCoinUsage(String coinUsage) {
		coinTemplate.opsForValue().set(TOTAL_COIN_USAGE_KEY_SUFFIX, coinUsage);
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

	/**
	 * 한 달 동안 동전 줍기를 행한 횟수 반환
	 *
	 * @param userId
	 * @return
	 */
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
	 * <p>
	 * 값이 존재한다면 횟수 증가, 없다면 1로 설정 후 당월의 마지막을 expire 로 설정
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
}
