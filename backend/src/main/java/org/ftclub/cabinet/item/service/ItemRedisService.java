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

	public boolean isCoinCollected(Long userId) {
		return itemRedis.isCoinCollected(userId.toString());
	}

	/**
	 * 당일 동전 줍기 처리 및 한 달 동안 유지되는 동전 줍기 횟수 증가 기능
	 *
	 * @param userId
	 */
	public void collectCoin(Long userId) {
		itemRedis.collectCoin(userId.toString());
		itemRedis.addCoinCollectionCount(userId.toString());
	}

	/**
	 * userId를 문자열로 변경하여 redis 내에서 조회
	 * <p>
	 * 존재하지 않는다면 캐싱 처리 없이 0을 반환, 존재한다면 Long 으로 변환하여 반환합니다.
	 *
	 * @param userId
	 * @return
	 */
	public Long getCoinCollectionCountInMonth(Long userId) {
		String userIdToString = userId.toString();
		String coinCollectionCount = itemRedis.getCoinCollectionCount(userIdToString);

		if (coinCollectionCount == null) {
			return 0L;
		}
		return Long.parseLong(coinCollectionCount);
	}
}
