package org.ftclub.cabinet.item.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.repository.ItemHistoryRepository;
import org.ftclub.cabinet.item.repository.ItemRedis;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemRedisService {

	private final ItemRedis itemRedis;
	private final ItemHistoryRepository itemHistoryRepository;

	public long getCoinCount(Long userId) {
		String userIdString = userId.toString();
		String coinCount = itemRedis.getCoinCount(userIdString);
		if (coinCount == null) {
			long coin = itemHistoryRepository.findAllByUserId(userId).stream()
					.mapToLong(ih -> ih.getItem().getPrice())
					.reduce(Long::sum).orElse(0L);
			itemRedis.saveCoinCount(userIdString, Long.toString(coin));
			return coin;
		}
		return Integer.parseInt(coinCount);
	}

	public void saveCoinCount(Long userId, long coinCount) {
		itemRedis.saveCoinCount(userId.toString(), String.valueOf(coinCount));
	}

	public boolean isCoinCollectable(Long userId) {
		return itemRedis.isCoinCollectable(userId.toString());
	}

	public void collectCoin(Long userId) {
		itemRedis.collectCoin(userId.toString());
	}
}
