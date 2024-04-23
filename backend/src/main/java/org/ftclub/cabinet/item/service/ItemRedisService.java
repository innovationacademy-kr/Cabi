package org.ftclub.cabinet.item.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.repository.ItemRedis;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemRedisService {

	private final ItemRedis itemRedis;


	public int getCoinCount(Long userId) {
		return Integer.parseInt(itemRedis.getCoinCount(userId.toString()));
	}

	public void saveCoinCount(Long userId, int coinCount) {
		itemRedis.saveCoinCount(userId.toString(), String.valueOf(coinCount));
	}

	public boolean isCoinCollectable(Long userId) {
		return itemRedis.isCoinCollectable(userId.toString());
	}

	public void collectCoin(Long userId) {
		itemRedis.collectCoin(userId.toString());
	}
}
