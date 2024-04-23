package org.ftclub.cabinet.item.repository;

import static java.util.concurrent.TimeUnit.SECONDS;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
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

	public boolean isCoinCollectable(String userId) {
		Boolean isCollected = coinTemplate.hasKey(userId + COIN_COLLECT_KEY_SUFFIX);
		return Objects.nonNull(isCollected) && isCollected;
	}

	public void collectCoin(String userId) {
		String key = userId + COIN_COLLECT_KEY_SUFFIX;
		coinTemplate.opsForValue().set(key, "collected");

		LocalDateTime todayEnd = LocalDate.now().atStartOfDay().plusDays(1);
		long expireTime = todayEnd.getSecond() - LocalDateTime.now().getSecond();
		coinTemplate.expire(key, expireTime, SECONDS);
	}
}
