package org.ftclub.cabinet.item.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
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
		itemRedis.addCoinCollectCount(userId.toString());
	}

	public Long getCollectCoinCount(Long userId, Long itemId) {
		String userIdToString = userId.toString();
		String coinCollectionCount = itemRedis.getCoinCollectionCount(userIdToString);

		// 처음 요청이 들어온거라면, itemHistoryRepository에서 받아온 뒤 저장하는게 나을지, redis에서 처리하는게 나을지?
		// 연속 출석 체크 기록에 대한 중요도에 따라?? redis가 있으니, 쓰는게 맞나?
		// +) 한 달이나 갖고 있어야하는데 ㄱㅊ?
		if (coinCollectionCount == null) {
			LocalDate today = LocalDate.now();
			LocalDate lastDayOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());

			LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();
			LocalDateTime endOfMonth = lastDayOfMonth.atTime(23, 59, 59);
			Long coinCollection =
				itemHistoryRepository.getCountByUserIdAndItemIdBetween(userId, itemId, startOfMonth,
					endOfMonth);
			itemRedis.saveCoinCollectionCount(userIdToString, coinCollection.toString());
			return coinCollection;
		}
		return Long.parseLong(coinCollectionCount);
	}
}
